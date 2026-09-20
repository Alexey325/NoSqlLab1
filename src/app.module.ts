import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';
import { CategoriesModule } from './categories/categories.module';
import { NotificationsModule } from './notifications/notifications.module';
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./auth/model/user.model";
import {Category} from "./categories/model/category.model";
import {Movie} from "./movies/model/movie.model";
import { RedisModule } from './redis/redis.module';
import { RolesModule } from './roles/roles.module';
import {Role} from "./roles/model/role.model";

@Module({
  controllers: [],
  providers: [],
  imports: [
      ConfigModule.forRoot({
        envFilePath: '.env',
      }),

      TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        entities: [User, Movie, Category, Role],
        autoLoadEntities: true,
        synchronize: true,
      }),

      AuthModule,
      MoviesModule,
      CategoriesModule,
      NotificationsModule,
      RedisModule,
      RolesModule
  ],
})

export class AppModule {}
