import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema()
export class Notification {
  @Prop({ required: true })
  message: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ required: true })
  type: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
