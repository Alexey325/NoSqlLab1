import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {LoginDto} from "./dto/login.dto";
import {RegisterDto} from "./dto/register.dto";
import {
    ApiBearerAuth,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse
} from "@nestjs/swagger";
import {JwtGuard} from "./guards/jwt.guard";
import type {UserRequestType} from "./types/user-request.type";

@Controller('auth')
@ApiTags("Авторизация")
export class AuthController {

    constructor(private authService: AuthService) {
    }

    @ApiOperation({
        summary: "Войти в приложение"
    })
    @ApiOkResponse({
        description: "Успешная авторизация",
        schema: {
            example: {
                token: "jwt-token",
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: "Неверный логин или пароль",
    })

    @Post('/login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @ApiOperation({
        summary: "Зарегистрироваться в приложении",
    })
    @ApiCreatedResponse({
        description: "Пользователь успешно зарегистрирован",
        schema: {
            example: {
                token: "jwt-token",
            },
        },
    })
    @ApiConflictResponse({
        description: "Пользователь с таким именем уже существует",
    })
    @Post('/register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Get("/me")
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: "Получить текущего пользователя",
    })
    @ApiOkResponse({
        description: "Текущий авторизованный пользователь",
    })
    @ApiUnauthorizedResponse({
        description: "Токен отсутствует, недействителен или истёк",
    })
    findUser(@Req() req: UserRequestType) {
        return this.authService.getCurrentUser(req.user.id);
    }


}
