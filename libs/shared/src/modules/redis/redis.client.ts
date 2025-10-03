import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { Redis as Client } from 'ioredis';

@Injectable()
export class RedisClient {
  private client: Client;
  private subscriber: Client;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {

    this.client = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
    });

    this.subscriber = this.client.duplicate();

    this.client.on('connect', () => Logger.log('Shared => RedisClient: Redis connected'));
    this.client.on('error', (err) => Logger.error('Shared => RedisClient: Redis Client Error', err));

    this.subscriber.on('connect', () => Logger.log('Shared => RedisClient: Redis subscriber connected'));
    this.subscriber.on('error', (err) => Logger.error('Shared => RedisClient: Redis Subscriber Error', err));
  }

  onModuleDestroy() {
    this.client.quit();
    this.subscriber.quit();
  }
  
  async get(key: string) {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number) {
    if (ttlSeconds) {
      await this.client.set(key, value, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string) {
    await this.client.del(key);
  }

  async publish(channel: string, message: string) {
    await this.client.publish(channel, message);
  }

  async subscribe(channel: string, handler: (message: string) => void) {
    await this.subscriber.subscribe(channel);
    this.subscriber.on('message', (ch, msg) => {
      if (ch === channel) {
        handler(msg);
      }
    });
  }
}
