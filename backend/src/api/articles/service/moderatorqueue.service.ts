import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ModeratorQueueArticle,
  ModeratorQueueArticleDocument,
} from '../schema/moderatorqueue.schema';
import {
  RejectedArticle,
  RejectedArticleDocument,
} from '../schema/rejected.schema';

@Injectable()
export class ModeratorQueueService {
  constructor(
    @InjectModel(ModeratorQueueArticle.name)
    private moderatorQueueArticleModel: Model<ModeratorQueueArticleDocument>,
    @InjectModel(RejectedArticle.name)
    private rejectedArticleModel: Model<RejectedArticleDocument>,
  ) {}

  async findAll(): Promise<ModeratorQueueArticle[]> {
    return this.moderatorQueueArticleModel.find().exec();
  }

  async submitArticle(
    article: ModeratorQueueArticle,
  ): Promise<ModeratorQueueArticle> {
    const newArticle = new this.moderatorQueueArticleModel(article);
    return newArticle.save();
  }

  async rejectArticle(id: string): Promise<void> {
    const article = await this.moderatorQueueArticleModel.findById(id).exec();
    if (article) {
      await this.rejectedArticleModel.create(article.toObject());
      await this.moderatorQueueArticleModel.findByIdAndDelete(id).exec();
    }
  }
}
