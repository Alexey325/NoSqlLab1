import {Injectable, OnModuleDestroy} from '@nestjs/common';
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleDestroy{

    private readonly client: Redis;

    constructor() {
        this.client = new Redis({
            host: 'localhost',
            port: 6379,
        });
    }

    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    async set(key: string, value: string, ttl?: number): Promise<'OK' | null> {
        if (ttl) {
            return this.client.set(key, value, 'EX', ttl);
        }

        return this.client.set(key, value);
    }

    // async del(key: string): Promise<number> {
    //     return this.client.del(key);
    // }

    async keys(pattern: string): Promise<string[]> {
        return this.client.keys(pattern);
    }

    //локи

    async setLock(key: string, token: string, ttl: number) : Promise<boolean> {
        const result = await this.client.set(key, token, 'EX', ttl, 'NX'); //nx - not exists

        return result === 'OK';
    }

    async delLock(key: string, token: string): Promise<number> {
        const tokenFromRedis = await this.get(key)

        if (token === tokenFromRedis) {
            return this.client.del(key);
        }

        return 0;
    }

    async onModuleDestroy() {
        await this.client.quit()
    }


}
