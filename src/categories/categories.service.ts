import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { AddCategoryDto } from './dto/add-category.dto';
import {Category} from "./model/category.model";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {RedisService} from "../redis/redis.service";

@Injectable()
export class CategoriesService {

    private readonly cachedCategoriesKey = 'category:';
    private readonly cachedCategoriesTtl = 300;

    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,

        private readonly redisService: RedisService,
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
            where: {name}
        });
    }

    async findById(id: number): Promise<Category> {
        const cacheKey = this.cachedCategoriesKey + id

        const cachedCategory = await this.redisService.get(cacheKey)

        if (cachedCategory) {
            return JSON.parse(cachedCategory);
        }

        const category =  await this.categoryRepository.findOne({
            where: {id},
            relations: {
                movies: true,
            },
        });

        if (!category) {
            throw new NotFoundException(`Категория с id ${id} не найдена`);
        }

        const categoryToCache = {
            id: category.id,
            name: category.name,
            movies: category.movies,
        };

        await this.redisService.set(cacheKey, JSON.stringify(categoryToCache), this.cachedCategoriesTtl);

        return category;
    }
}