import { Injectable } from '@nestjs/common';
import { MovieNotification } from './types/notification.interface';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class NotificationsService {

    private readonly notificationKeyPrefix = 'notification:';
    private readonly notificationTtl = 3 * 60 * 60;

    private nextId = 1;

    constructor(
        private readonly redisService: RedisService,
    ) {}

     scheduleNotification(title: string, message: string, showDate: Date): void {
        const notificationDate = showDate.getTime() - this.notificationTtl * 1000;

        const delay = notificationDate - Date.now();

        if (delay <= 0) {
            if (showDate.getTime() > Date.now()) {
                 void this.createNotification(title, message, showDate);
            }

            return;
        }

        setTimeout(() => {
            void this.createNotification(title, message, showDate);
        }, delay);
    }

    private async createNotification(title: string, message: string, showDate: Date): Promise<MovieNotification> {

        const notification: MovieNotification = {
            id: this.nextId++,
            title,
            message,
            createdAt: new Date(),
        };

        const ttl = Math.floor(
            (showDate.getTime() - Date.now()) / 1000,
        );

        await this.redisService.set(
            `${this.notificationKeyPrefix}${notification.id}`,
            JSON.stringify(notification),
            ttl,
        );

        return notification;
    }

    //оставил keys в рамках лабы, но операция тяжелая, можно оптимизировать используя scan и загружая итеративно по несколько штук

    async findAllNotifications(): Promise<MovieNotification[]> {
        const keys = await this.redisService.keys(
            `${this.notificationKeyPrefix}*`,
        );

        const notifications = await Promise.all(
            keys.map(async (key) => {
                const value = await this.redisService.get(key);

                if (!value) {
                    return null;
                }

                return JSON.parse(value) as MovieNotification;
            }),
        );

        return notifications.filter(
            (notification) => notification !== null,
        );
    }
}