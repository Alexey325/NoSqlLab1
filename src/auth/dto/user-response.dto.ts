import {ApiProperty} from "@nestjs/swagger";
import {Role} from "../../roles/model/role.model";

export class UserResponseDto {

    @ApiProperty({
        description: "Id пользователя",
        example: "3",
    })
    id: number;

    @ApiProperty({
        description: "Имя пользователя",
        example: "Alexey",
    })
    username: string;

    @ApiProperty({
        description: "Роли пользователя",
        example: "ADMIN",
    })
    roles: Role[];
}