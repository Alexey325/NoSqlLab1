import {ApiProperty} from "@nestjs/swagger";

export class CreateRoleDto {
    @ApiProperty({
        description: "Название роли",
        example: "ADMIN",
    })
    readonly value: string;

    @ApiProperty({
        description: "Описание роли",
        example: "Администратор может добавлять категории и фильмы",
    })
    readonly description: string;
}