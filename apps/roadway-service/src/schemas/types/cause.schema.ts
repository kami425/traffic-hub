import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Cause {
  @Prop({ required: true })
  block!: boolean;

  @Prop({ required: true })
  crowding!: boolean;
}

export const CauseSchema = SchemaFactory.createForClass(Cause);
