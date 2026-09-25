import {Injectable, OnModuleDestroy} from '@nestjs/common';
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleDestroy {

    private readonly pool: Redis[];
    private nextClientIndex = 0;

    constructor() {
        const host = process.env.LOCAL_REDIS_HOST || 'localhost';
        const port = Number(process.env.LOCAL_REDIS_PORT) || 6379;
        const poolSize = Number(process.env.REDIS_POOL_SIZE) || 3;

        this.pool = Array.from({length: poolSize}, () => new Redis({
            host,
            port,
            maxRetriesPerRequest: 3,
            connectTimeout: 5000,
            retryStrategy: (times: number) => Math.min(times * 200, 2000),
        }));
    }

    private nextClient(): Redis {
        const client = this.pool[this.nextClientIndex];
        this.nextClientIndex = (this.nextClientIndex + 1) % this.pool.length;

        return client;
    }

    async get(key: string): Promise<string | null> {
        return this.nextClient().get(key);
    }

    async set(key: string, value: string, ttl?: number): Promise<'OK' | null> {
        if (ttl) {
            return this.nextClient().set(key, value, 'EX', ttl);
        }

        return this.nextClient().set(key, value);
    }

    async del(key: string): Promise<number> {
        return this.nextClient().del(key);
    }

    async keys(pattern: string): Promise<string[]> {
        return this.nextClient().keys(pattern);
    }

    async onModuleDestroy() {
        await Promise.all(this.pool.map((client) => client.quit()));
    }
}
