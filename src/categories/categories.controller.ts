import {Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards} from '@nestjs/common';
import {AddCategoryDto} from "./dto/add-category.dto";
import {CategoriesService} from "./categories.service";
import {ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {RolesGuard} from "../auth/guards/role.guard";
import {Roles} from "../auth/guards/decorators/role.decorator";
import {JwtGuard} from "../auth/guards/jwt.guard";

@Controller('categories')
@ApiTags('Категории фильмов')
export class CategoriesController {

    constructor(private readonly categoriesService: CategoriesService) {}

    @Get()
    @UseGuards(JwtGuard)
    @ApiOperation({
        summary: 'Получить список всех категорий',
    })
    @ApiOkResponse({
        description: 'Список категорий успешно получен',
    })
    findAllCategories() {
        return this.categoriesService.findAll();
    }

    @Get('/:id')
    @UseGuards(JwtGuard)
    @ApiOperation({
        summary: 'Получить категорию по Id',
    })
    @ApiCreatedResponse({
        description: 'Категория успешно получена',
    })
    findCategory(@Param("id", ParseIntPipe) id: number) {
        return this.categoriesService.findById(id);
    }

    @Post()
    @Roles("ADMIN")
    @UseGuards(RolesGuard)
    @ApiOperation({
        summary: 'Добавить новую категорию',
    })
    @ApiCreatedResponse({
        description: 'Категория успешно создана',
    })
    addCategory(@Body() dto: AddCategoryDto) {
        return this.categoriesService.create(dto);
    }

}
