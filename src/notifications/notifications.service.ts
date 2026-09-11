import { Injectable } from '@nestjs/common';
import {randomUUID} from "node:crypto";
import {MovieNotification} from "./types/notification.interface";

@Injectable()
export class NotificationsService {
    private readonly notifications = new Map<string, MovieNotification>();

    scheduleNotification(title: string, message: string, showDate: Date): void {
        const notificationDate = showDate.getTime() - 3 * 60 * 60 * 1000;
        const delay = notificationDate - Date.now();

        if (delay <= 0) {
            this.createNotification(title, message);
            return;
        }

        setTimeout(() => {
            this.createNotification(title, message);
        }, delay);
    }

    createNotification(title: string, message: string): MovieNotification {
        const notification: MovieNotification = {
            id: randomUUID(),
            title,
            message,
            createdAt: new Date(),
        };

        this.notifications.set(notification.id, notification);

        return notification;
    }

    findAllNotifications(): MovieNotification[] {
        return Array.from(this.notifications.values());
    }
}
