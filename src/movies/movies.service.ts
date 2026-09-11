import { Injectable, NotFoundException } from '@nestjs/common';
import { AddMovieDto } from './dto/add-movie.dto';
import { Movie } from './types/movie.type';
import {randomUUID} from "node:crypto";
import {CategoriesService} from "../categories/categories.service";
import {NotificationsService} from "../notifications/notifications.service";
import {parseShowDate} from "./utils/show-date.parser";

@Injectable()
export class MoviesService {

    constructor(private readonly categoryService: CategoriesService,
                private readonly notificationsService: NotificationsService) {}

    private readonly movies = new Map<string, Movie>();

    findAllMovies(): Movie[] {
        return Array.from(this.movies.values());
    }

    addMovie(dto: AddMovieDto): Movie {
        const category = this.categoryService.findByName(dto.category)
        if (!category) {
            throw new NotFoundException(`Category ${dto.category} not found`);
        }

        const showDate = parseShowDate(dto.showDate);

        const movie: Movie = {
            id: randomUUID(),
            title: dto.title,
            description: dto.description,
            showDate,
            categoryId: category.id
        };

        this.movies.set(movie.id, movie);

        this.notificationsService.scheduleNotification(
            'Премьера дня',
            `Сегодня показываем фильм «${movie.title}».`,
            movie.showDate,
        );

        return movie;
    }
}