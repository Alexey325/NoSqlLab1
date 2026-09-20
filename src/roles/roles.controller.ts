import {Body, Controller, Get, Post} from '@nestjs/common';
import {ApiConflictResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {RolesService} from "./roles.service";
import {CreateRoleDto} from "./dto/create-role.dto";

@Controller("roles")
@ApiTags("Роли")
export class RolesController {

    constructor(
        private readonly roleService: RolesService,
    ) {}

    @Post()
    @ApiOperation({
        summary: "Создать роль",
    })
    @ApiCreatedResponse({
        description: "Роль успешно создана",
    })
    @ApiConflictResponse({
        description: "Роль с таким названием уже существует",
    })
    async createRole(@Body() createRoleDto: CreateRoleDto) {
        return await this.roleService.createRole(createRoleDto);
    }

    @Get()
    @ApiOperation({
        summary: "Получить все роли",
    })
    @ApiOkResponse({
        description: "Список ролей",
        isArray: true,
    })
    async getAllRoles() {
        return await this.roleService.getAllRoles();
    }

}

