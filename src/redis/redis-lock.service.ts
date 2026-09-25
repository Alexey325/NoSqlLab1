import {ConflictException, Injectable, OnModuleDestroy} from '@nestjs/common';
import Redis from 'ioredis';
import Redlock from 'redlock';

type RedlockClient = Redlock.CompatibleRedisClient;
type Lock = Redlock.Lock;

@Injectable()
export class RedisLockService implements OnModuleDestroy {

    private readonly nodes: Redis[];
    private readonly redlock: Redlock;

    constructor() {
        const nodeAddresses = (process.env.REDIS_NODES || 'localhost:6379')
            .split(',')
            .map((address) => address.trim())
            .filter(Boolean);

        this.nodes = nodeAddresses.map((address) => {
            const [host, port] = address.split(':');

            return new Redis({
                host,
                port: Number(port),
                maxRetriesPerRequest: 3,
                connectTimeout: 5000,
                retryStrategy: (times: number) => Math.min(times * 200, 2000),
            });
        });

        this.redlock = new Redlock(this.nodes as unknown as RedlockClient[], {
            retryCount: 0, //без повторных попыток, при занятом локе сразу отвечаем 409
        });
    }

    async acquireScheduleLock(dateKeys: string[], ttlMs: number): Promise<Lock> {
        const resources = dateKeys.map((dateKey) => `lock:${dateKey}`);

        try {
            return await this.redlock.acquire(resources, ttlMs);
        } catch {
            throw new ConflictException('Расписание сейчас изменяется другим запросом');
        }
    }

    async release(lock: Lock): Promise<void> {
        await this.redlock.release(lock);
    }

    async broadcastEditingFlag(dateKeys: string[], ttlMs: number): Promise<void> {
        await Promise.allSettled(
            dateKeys.flatMap((dateKey) =>
                this.nodes.map((node) => node.set(`editing:${dateKey}`, '1', 'PX', ttlMs)),
            ),
        );
    }

    async onModuleDestroy() {
        await Promise.all(this.nodes.map((node) => node.quit()));
    }
}
