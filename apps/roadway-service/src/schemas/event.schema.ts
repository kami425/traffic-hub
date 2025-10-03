import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Road } from './road.schema';
import { Cause, CauseSchema } from './types/cause.schema';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
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

export const EventSchema = SchemaFactory.createForClass(Event);
