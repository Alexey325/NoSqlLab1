import {forwardRef, Module} from '@nestjs/common';
import {RolesService} from "./roles.service";
import {RolesController} from "./roles.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Role} from "./model/role.model";
import {AuthModule} from "../auth/auth.module";

@Module({
    controllers: [RolesController],
    providers: [RolesService],
    imports: [
        TypeOrmModule.forFeature([Role]),
        forwardRef(() => AuthModule),
    ],
    exports: [RolesService]
})

export class RolesModule {}
