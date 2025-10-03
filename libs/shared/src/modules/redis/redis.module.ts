import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { RedisClient } from './redis.client';
import { DI } from '../../utils/constants';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DI.REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
        });
      },
    },
    RedisClient
  ],
  exports: [RedisClient, DI.REDIS_CLIENT],
})
export class RedisModule {}
