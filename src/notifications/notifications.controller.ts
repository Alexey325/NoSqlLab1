import {Controller, Get, UseGuards} from '@nestjs/common';
import {NotificationsService} from "./notifications.service";
import {JwtGuard} from "../auth/guards/jwt.guard";

@Controller('notifications')
export class NotificationsController {

    constructor(private readonly notificationsService: NotificationsService) {}

    @Get()
    @UseGuards(JwtGuard)
    findAllNotifications() {
        return this.notificationsService.findAllNotifications();
    }
}
