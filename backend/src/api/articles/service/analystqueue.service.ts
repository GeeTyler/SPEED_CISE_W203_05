import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AnalystQueueArticle, AnalystQueueArticleDocument } from '../schema/analystqueue.schema';
import { Model } from 'mongoose';

@Injectable()
export class AnalystQueueService {
  constructor(
    @InjectModel(AnalystQueueArticle.name)
    private analystQueueArticleModel: Model<AnalystQueueArticleDocument>,
  ) {}

  async findAll(): Promise<AnalystQueueArticle[]> {
    return this.analystQueueArticleModel.find().exec();
  }

  async addArticle(articleData: any): Promise<AnalystQueueArticle> {
    const newArticle = new this.analystQueueArticleModel(articleData);
    return newArticle.save();
  }
}
