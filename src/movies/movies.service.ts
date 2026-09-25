import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { AddMovieDto } from './dto/add-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CategoriesService } from '../categories/categories.service';
import { NotificationsService } from '../notifications/notifications.service';
import { parseShowDate } from './utils/show-date.parser';
import {
    getDayBounds,
    hasTimeConflict,
} from './utils/movie-schedule.utils';
import { Repository, Between } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './model/movie.model';
import {RedisService} from "../redis/redis.service";
import {RedisLockService} from "../redis/redis-lock.service";

export type MoviesOrEditingNotice = Movie[] | { editing: true; message: string };

@Injectable()
export class MoviesService {

    private readonly lockTtlMs = 300 * 1000;
    private readonly moviesCacheKey = 'movies:all';
    private readonly editingFlagPrefix = 'editing:';
    private readonly propagationDelayMs = Number(process.env.SCHEDULE_PROPAGATION_DELAY_MS) || 5000;

    constructor(
        @InjectRepository(Movie)
        private readonly movieRepository: Repository<Movie>,

        private readonly categoryService: CategoriesService,
        private readonly notificationsService: NotificationsService,
        private readonly redisService: RedisService,
        private readonly redisLockService: RedisLockService,
    ) {}

    async findAllMovies(): Promise<MoviesOrEditingNotice> {
       //пока все узлы не получат свежие данные (задержка имитирована) расписание не отдаем
        const editingKeys = await this.redisService.keys(`${this.editingFlagPrefix}*`);

        if (editingKeys.length > 0) {
            return {
                editing: true,
                message: 'Ведутся правки в расписании'
            };
        }

        const cached = await this.redisService.get(this.moviesCacheKey);

        if (cached) {
            return JSON.parse(cached) as Movie[];
        }

        const movies = await this.movieRepository.find({
            relations: {
                category: true,
            },
        });

        await this.redisService.set(
            this.moviesCacheKey,
            JSON.stringify(movies),
            Math.ceil(this.propagationDelayMs / 1000),
        );

        return movies;
    }

    async addMovie(dto: AddMovieDto): Promise<Movie> {
        const category = await this.categoryService.findByName(dto.category);

        if (!category) {
            throw new NotFoundException(`Категория ${dto.category} не найдена`);
        }

        const showDate = parseShowDate(dto.showDate);

        const { startOfDay, endOfDay } = getDayBounds(showDate);
        const dateKey = showDate.toISOString().slice(0, 10); //формат YYYY-MM-DD для ключа лока

        const lock = await this.redisLockService.acquireScheduleLock([dateKey], this.lockTtlMs);

        try {
            const moviesOnThisDay = await this.movieRepository.find({
                where: {
                    showDate: Between(startOfDay, endOfDay),
                },
            });

            if (hasTimeConflict(showDate, dto.duration, moviesOnThisDay)) {
                throw new ConflictException('На указанное время уже запланирован другой фильм');
            }

            const movie = this.movieRepository.create({
                title: dto.title,
                description: dto.description,
                showDate,
                category,
                duration: dto.duration,
            });

            await this.movieRepository.save(movie);

            this.notificationsService.scheduleNotification(
                'Премьера дня',
                `Сегодня в ${dto.showDate} показываем фильм «${movie.title}».`,
                movie.showDate,
            );

            await this.redisService.del(this.moviesCacheKey);

            return movie;
        } finally {
            await this.redisLockService.release(lock);
        }

    }

    async updateMovie(id: number, dto: UpdateMovieDto): Promise<Movie> {
        const movie = await this.findById(id);

        const showDate = parseShowDate(dto.showDate);
        const duration = dto.duration ?? movie.duration;

        const oldDateKey = movie.showDate.toISOString().slice(0, 10);
        const newDateKey = showDate.toISOString().slice(0, 10);
        const dateKeys = oldDateKey === newDateKey ? [oldDateKey] : [oldDateKey, newDateKey];

        const lock = await this.redisLockService.acquireScheduleLock(dateKeys, this.lockTtlMs);

        try {
            await this.redisLockService.broadcastEditingFlag(dateKeys, this.propagationDelayMs);

            const { startOfDay, endOfDay } = getDayBounds(showDate);

            const moviesOnNewDay = await this.movieRepository.find({
                where: {
                    showDate: Between(startOfDay, endOfDay),
                },
            });

            const otherMovies = moviesOnNewDay.filter((otherMovie) => otherMovie.id !== movie.id);

            if (hasTimeConflict(showDate, duration, otherMovies)) {
                throw new ConflictException('На указанное время уже запланирован другой фильм');
            }

            movie.showDate = showDate;
            movie.duration = duration;

            await this.movieRepository.save(movie);

            this.notificationsService.scheduleNotification(
                'Расписание изменено',
                `Фильм «${movie.title}» перенесён на ${dto.showDate}.`,
                movie.showDate,
            );

            return movie;
        } finally {
            await this.redisLockService.release(lock);
        }
    }

    async findById(id: number): Promise<Movie> {
        const movie = await this.movieRepository.findOne({
            where: { id },
            relations: {
                category: true,
            },
        });

        if (!movie) {
            throw new NotFoundException(`Фильм с id ${id} не найден`);
        }

        return movie;
    }
}