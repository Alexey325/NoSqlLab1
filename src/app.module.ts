import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';
import { CategoriesModule } from './categories/categories.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [AuthModule, MoviesModule, CategoriesModule, NotificationsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
