import {Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards} from '@nestjs/common';
import {AddMovieDto} from "./dto/add-movie.dto";
import {UpdateMovieDto} from "./dto/update-movie.dto";
import {MoviesService} from "./movies.service";
import {ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {Roles} from "../auth/guards/decorators/role.decorator";
import {RolesGuard} from "../auth/guards/role.guard";
import {JwtGuard} from "../auth/guards/jwt.guard";

@Controller('movies')
@ApiTags('Фильмы')
export class MoviesController {

    constructor(private readonly movieService: MoviesService) {}

    @Get()
    @UseGuards(JwtGuard)
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
    @UseGuards(JwtGuard)
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
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
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

    @Patch('/:id')
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @ApiOperation({
        summary: 'Изменить время показа фильма',
    })
    @ApiBody({
        type: UpdateMovieDto,
    })
    @ApiOkResponse({
        description: 'Фильм успешно обновлён',
    })
    updateMovie(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMovieDto) {
        return this.movieService.updateMovie(id, dto);
    }

}
