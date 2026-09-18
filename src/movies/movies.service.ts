import { Injectable, NotFoundException } from '@nestjs/common';
import { AddMovieDto } from './dto/add-movie.dto';
import {CategoriesService} from "../categories/categories.service";
import {NotificationsService} from "../notifications/notifications.service";
import {parseShowDate} from "./utils/show-date.parser";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {Movie} from "./model/movie.model";

@Injectable()
export class MoviesService {

    constructor(
        @InjectRepository(Movie)
        private readonly movieRepository: Repository<Movie>,

        private readonly categoryService: CategoriesService,
        private readonly notificationsService: NotificationsService,
    ) {}

    async findAllMovies(): Promise<Movie[]> {
        return this.movieRepository.find({
            relations: {
                category: true,
            },
        });
    }


    async addMovie(dto: AddMovieDto): Promise<Movie> {
        const category = await this.categoryService.findByName(dto.category);

        if (!category) {
            throw new NotFoundException(`Категория ${dto.category} не найдена`);
        }

        const showDate = parseShowDate(dto.showDate);

        const movie = this.movieRepository.create({
            title: dto.title,
            description: dto.description,
            showDate,
            category,
        });

        await this.movieRepository.save(movie);

        this.notificationsService.scheduleNotification(
            'Премьера дня',
            `Сегодня показываем фильм «${movie.title}».`,
            movie.showDate,
        );

        return movie;
    }

    async findById(id: number): Promise<Movie> {
        const movie = await this.movieRepository.findOne({
            where: {id},
            relations: {
                category: true,
            },
        })

        if (!movie) {
            throw new NotFoundException(`Фильм с id ${id} не найден`);
        }

        return movie;

    }
}