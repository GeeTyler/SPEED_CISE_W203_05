import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  AnalystQueueArticle,
  AnalystQueueArticleDocument,
} from '../schema/analystqueue.schema';
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

  async findById(id: string): Promise<AnalystQueueArticle> {
    const article = await this.analystQueueArticleModel.findById(id).exec();
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  async deleteArticle(id: string): Promise<void> {
    const result = await this.analystQueueArticleModel
      .deleteOne({ _id: id })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Article not found');
    }
  }
}
