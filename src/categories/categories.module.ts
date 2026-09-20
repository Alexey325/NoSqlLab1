import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Category} from "./model/category.model";
import {AuthModule} from "../auth/auth.module";

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [
    TypeOrmModule.forFeature([Category]),
    AuthModule
  ],
  exports: [CategoriesService]
})

export class CategoriesModule {}
