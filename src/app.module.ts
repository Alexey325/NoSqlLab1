import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [AuthModule, MoviesModule, CategoriesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
