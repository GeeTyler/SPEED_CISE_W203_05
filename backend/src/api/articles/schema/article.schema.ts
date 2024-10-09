import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArticleDocument = Article & Document;

@Schema()
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [Number], default: [] }) // Array of ratings
  ratings: number[];

  @Prop({ default: Date.now }) // Automatically set the created date
  createdAt: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
