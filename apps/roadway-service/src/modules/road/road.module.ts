import { Module } from '@nestjs/common';
import { RoadController } from './road.controller';
import { RoadService } from './road.service';
import { MongoModule } from '../mongo/mongo.module';
import { SharedModule } from '@traffic-hub/shared';

@Module({
  imports: [MongoModule, SharedModule],
  controllers: [RoadController],
  providers: [RoadService],
})
export class RoadModule {}
