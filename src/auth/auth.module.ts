import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {JwtModule} from "@nestjs/jwt";
import {JwtGuard} from "./guards/jwt.guard";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./model/user.model";
import {RolesModule} from "../roles/roles.module";
import {RolesGuard} from "./guards/role.guard";

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtGuard, RolesGuard],
  imports: [
      TypeOrmModule.forFeature([User]),
      JwtModule.register(
        {secret: process.env.JWT_SECRET || 'secret'},
      ),
      RolesModule,
  ],
  exports: [JwtGuard, JwtModule, RolesGuard]
})

export class AuthModule {}
