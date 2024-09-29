import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AnalystQueueArticleDocument = HydratedDocument<AnalystQueueArticle>;

@Schema()
export class AnalystQueueArticle {
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
}

export const AnalystQueueArticleSchema = SchemaFactory.createForClass(AnalystQueueArticle);
