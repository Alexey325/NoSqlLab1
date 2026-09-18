import {Body, Controller, Get, Param, ParseIntPipe, Post} from '@nestjs/common';
import {AddMovieDto} from "./dto/add-movie.dto";
import {MoviesService} from "./movies.service";
import {ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";

@Controller('movies')
@ApiTags('Фильмы')
export class MoviesController {

    constructor(private readonly movieService: MoviesService) {}

    @Get()
    @ApiOperation({
        summary: 'Получить список всех фильмов',
    })
    @ApiOkResponse({
        description: 'Список фильмов успешно получен',
    })
    findAllMovies() {
        return this.movieService.findAllMovies();
    }

    @Get('/:id')
    @ApiOperation({
        summary: 'Получить фильм по id',
    })
    @ApiOkResponse({
        description: 'Фильм успешно получен',
    })
    findMovie(@Param('id', ParseIntPipe) id: number) {
        return this.movieService.findById(id);
    }

    @Post()
    @ApiOperation({
        summary: 'Добавить новый фильм',
    })
    @ApiBody({
        type: AddMovieDto,
    })
    @ApiCreatedResponse({
        description: 'Фильм успешно добавлен',
    })
    addMovie(@Body() dto: AddMovieDto) {
        return this.movieService.addMovie(dto);
    }

}
