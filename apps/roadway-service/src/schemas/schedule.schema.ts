import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Road } from './road.schema';
import { Cause, CauseSchema } from './types/cause.schema';

export type ScheduleDocument = Schedule & Document;

@Schema({ timestamps: true })
export class Schedule {
  @Prop({ required: true, length: 50 })
  name!: string;

  @Prop({ default: true })
  IsActive!: boolean;

  @Prop({ required: true })
  Start!: Date;

  @Prop({ required: true })
  End!: Date;

  @Prop()
  Description!: string;

  @Prop({ required: true, type: CauseSchema })
  Cause!: Cause;
  
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Road',
    required: true,
  })
  Road!: Road;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
