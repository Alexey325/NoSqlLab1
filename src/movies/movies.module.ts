import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import {CategoriesService} from "../categories/categories.service";
import {CategoriesModule} from "../categories/categories.module";

@Module({
  controllers: [MoviesController],
  providers: [MoviesService],
  imports: [CategoriesModule]
})

export class MoviesModule {}
