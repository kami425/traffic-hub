import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '@traffic-hub/shared';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), SharedModule],
})
export class AppModule {}
