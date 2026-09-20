import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import {AuthModule} from "../auth/auth.module";

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  imports: [AuthModule],
  exports: [NotificationsService]
})

export class NotificationsModule {}
