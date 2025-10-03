import { Module } from '@nestjs/common';
import { MongoClient } from './mongo.client';
import { MongooseModule } from '@nestjs/mongoose';
import { Pattern, Event, Road, Schedule, RoadSchema, EventSchema, ScheduleSchema, PatternSchema } from '../../schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Road.name, schema: RoadSchema },
      { name: Event.name, schema: EventSchema },
      { name: Schedule.name, schema: ScheduleSchema },
      { name: Pattern.name, schema: PatternSchema },
    ]),
  ],
  providers: [MongoClient],
  exports: [MongoClient]
})
export class MongoModule {}
