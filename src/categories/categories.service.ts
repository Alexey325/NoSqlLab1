import {ConflictException, Injectable} from '@nestjs/common';
import { AddCategoryDto } from './dto/add-category.dto';
import {randomUUID} from "node:crypto";
import {Category} from "./model/category.model";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class CategoriesService {

    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) {}

    async findAll(): Promise<Category[]> {
        return this.categoryRepository.find();
    }

    async create(dto: AddCategoryDto): Promise<Category> {
        const existingCategory = await this.findByName(dto.name);

        if (existingCategory) {
            throw new ConflictException(
                'Категория с таким названием уже существует',
            );
        }

        const category = this.categoryRepository.create({
            name: dto.name,
        });

        return this.categoryRepository.save(category);
    }

    async findByName(name: string): Promise<Category | null> {
        return this.categoryRepository.findOne({
            where: {name},
        });
    }
}