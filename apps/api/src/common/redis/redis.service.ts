import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { duration } from 'src/utils';

@Injectable()
export class RedisService {
    private readonly client: Redis;
    private readonly logger = new Logger(RedisService.name);

    constructor(
       private readonly configService: ConfigService,
    ) {
        // make wne init module
        this.client = new Redis({
            host: this.configService.get<string>('REDIS_HOST'),
            port: this.configService.get<number>('REDIS_PORT'),
            password: this.configService.get<string>('REDIS_PASSWORD'),
            username: this.configService.get<string>('REDIS_USERNAME'),
        });

        this.logger.log('🚀 Connected to Redis Server!')
    }

    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    async delete(key: string): Promise<void> {
        await this.client.del(key);
    }

    async exists(key: string): Promise<boolean> {
        return (await this.client.exists(key)) === 1;
    }

    async set(key: string, value: string, expire?: string): Promise<void> {
    
        if(!expire) {
            this.client.set(key, value);
            return;
        }

        await this.client.setex(key, duration(expire), value);
    }

    async increment(key: string): Promise<number> {
        return this.client.incr(key);
    }

    async decrement(key: string): Promise<number> {
        return this.client.decr(key);
    }

    async getKeys(pattern: string): Promise<string[]> {
        return this.client.keys(pattern);
    }
}
