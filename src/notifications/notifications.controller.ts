import {Controller, Get, UseGuards} from '@nestjs/common';
import {NotificationsService} from "./notifications.service";
import {JwtGuard} from "../auth/guards/jwt.guard";
import {ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";

@Controller('notifications')
@ApiTags('Уведомления')
export class NotificationsController {

    constructor(private readonly notificationsService: NotificationsService) {}

    @Get()
    @UseGuards(JwtGuard)
    @ApiOperation({
        summary: 'Получить список всех уведомлений',
    })
    @ApiOkResponse({
        description: 'Список уведомлений успешно получен',
    })
    findAllNotifications() {
        return this.notificationsService.findAllNotifications();
    }
}
