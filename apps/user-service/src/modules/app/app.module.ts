import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from '@traffic-hub/shared';
import { KeyCloakHelper } from '../../utils/keyCloak.helper';
import { PeismaModule } from '../prisma/peisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    SharedModule,
    PeismaModule,
  ],
  controllers: [AppController],
  providers: [AppService, KeyCloakHelper],
})
export class AppModule {}
