import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import {CategoriesService} from "../categories/categories.service";
import {CategoriesModule} from "../categories/categories.module";
import {NotificationsModule} from "../notifications/notifications.module";

@Module({
  controllers: [MoviesController],
  providers: [MoviesService],
  imports: [CategoriesModule, NotificationsModule]
})

export class MoviesModule {}
