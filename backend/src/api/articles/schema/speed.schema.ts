import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SpeedArticleDocument = HydratedDocument<SpeedArticle>;

@Schema()
export class SpeedArticle {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  authors: string;

  @Prop({ required: true })
  journal: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  doi: string;

  @Prop({ required: true })
  publisher: string;

  @Prop({ type: Date, default: Date.now })
  submittedAt: Date;

  @Prop({ required: true })
  claim: string;

  @Prop({ type: [Number], default: [] })
  ratings: number[];
}

export const SpeedArticleSchema = SchemaFactory.createForClass(SpeedArticle);
