import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import {CategoriesModule} from "../categories/categories.module";
import {NotificationsModule} from "../notifications/notifications.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Movie} from "./model/movie.model";
import {AuthModule} from "../auth/auth.module";

@Module({
  controllers: [MoviesController],
  providers: [MoviesService],
  imports: [
      TypeOrmModule.forFeature([Movie]),
      CategoriesModule,
      NotificationsModule,
      AuthModule
  ]
})

export class MoviesModule {}
