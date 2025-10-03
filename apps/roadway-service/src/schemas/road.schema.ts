import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoadDocument = Road & Document;

@Schema({ timestamps: true })
export class Road {
  @Prop({ required: true, length: 50 })
  name!: string;

  @Prop({ default: true })
  IsOpen!: boolean;
}

export const RoadSchema = SchemaFactory.createForClass(Road);
