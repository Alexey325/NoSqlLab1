import {ApiProperty} from "@nestjs/swagger";

export class RegisterDto {
    @ApiProperty({
        description: "Имя пользователя",
        example: "Alexey",
    })
    username: string;

    @ApiProperty({
        description: "Пароль",
        example: "123456",
    })
    password: string;
}