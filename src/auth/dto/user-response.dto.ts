import {ApiProperty} from "@nestjs/swagger";

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
}