import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Date } from 'mongoose';

export type RejectedArticleDocument = HydratedDocument<RejectedArticle>;

@Schema()
export class RejectedArticle {
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

export const RejectedArticleSchema =
  SchemaFactory.createForClass(RejectedArticle);
