import {Body, Controller, Get, Post} from '@nestjs/common';
import {AddCategoryDto} from "./dto/add-category.dto";
import {CategoriesService} from "./categories.service";

@Controller('categories')
export class CategoriesController {

    constructor(private readonly categoriesService: CategoriesService) {}

    @Get()
    findAllCategories() {
        return this.categoriesService.findAll();
    }

    @Post()
    addCategory(@Body() dto: AddCategoryDto) {
        return this.categoriesService.create(dto);
    }

}
