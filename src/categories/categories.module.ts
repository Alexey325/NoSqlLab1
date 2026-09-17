import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../auth/model/user.model";
import {Category} from "./model/category.model";

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [
    TypeOrmModule.forFeature([Category])
  ],
  exports: [CategoriesService]
})

export class CategoriesModule {}
