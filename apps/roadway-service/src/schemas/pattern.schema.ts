import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Road } from './road.schema';
import { Cause, CauseSchema } from './types/cause.schema';

export type PatternDocument = Pattern & Document;

@Schema({ timestamps: true })
export class Pattern {
  @Prop({ required: true, length: 50 })
  name!: string;

  @Prop({ default: true })
  IsActive!: boolean;

  @Prop({ required: true })
  Start!: number;

  @Prop({ required: true })
  End!: number;

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

export const PatternSchema = SchemaFactory.createForClass(Pattern);
