import {Body, Controller, Get, Post} from '@nestjs/common';
import {AddCategoryDto} from "./dto/add-category.dto";
import {CategoriesService} from "./categories.service";
import {ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";

@Controller('categories')
@ApiTags('Категории фильмов')
export class CategoriesController {

    constructor(private readonly categoriesService: CategoriesService) {}

    @Get()
    @ApiOperation({
        summary: 'Получить список всех категорий',
    })
    @ApiOkResponse({
        description: 'Список категорий успешно получен',
    })
    findAllCategories() {
        return this.categoriesService.findAll();
    }

    @Post()
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
