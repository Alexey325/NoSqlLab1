import { Injectable } from '@nestjs/common';
import { AddCategoryDto } from './dto/add-category.dto';
import {randomUUID} from "node:crypto";
import {Category} from "./types/category.type";

@Injectable()
export class CategoriesService {
    private readonly categories = new Map<string, Category>();

    findAll(): Category[] {
        return Array.from(this.categories.values());
    }

    create(dto: AddCategoryDto): Category {
        const category: Category = {
            id: randomUUID(),
            ...dto,
        };

        this.categories.set(category.id, category);

        return category;
    }

    findByName(name: string): Category | undefined {
        return [...this.categories.values()]
            .find(category => category.name === name);
    }
}