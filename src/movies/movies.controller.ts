import {Body, Controller, Get, Param, ParseIntPipe, Post} from '@nestjs/common';
import {AddMovieDto} from "./dto/add-movie.dto";
import {MoviesService} from "./movies.service";

@Controller('movies')
export class MoviesController {

    constructor(private readonly movieService: MoviesService) {}

    @Get()
    findAllMovies() {
        return this.movieService.findAllMovies();
    }

    @Post()
    addMovie(@Body() dto: AddMovieDto) {
        return this.movieService.addMovie(dto);
    }




}
