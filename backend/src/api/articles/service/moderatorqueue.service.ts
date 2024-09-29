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
import { 
  AnalystQueueArticle, 
  AnalystQueueArticleDocument 
} from '../schema/analystqueue.schema';
import { Notification, NotificationDocument } from '../schema/notification.schema';
import { NotificationService } from './notification.service';


@Injectable()
export class ModeratorQueueService {
  constructor(
    @InjectModel(ModeratorQueueArticle.name)
    private moderatorQueueArticleModel: Model<ModeratorQueueArticleDocument>,
    @InjectModel(RejectedArticle.name)
    private rejectedArticleModel: Model<RejectedArticleDocument>,
    @InjectModel(AnalystQueueArticle.name)
    private analystQueueArticleModel: Model<AnalystQueueArticleDocument>,
    private notificationService: NotificationService, 
  ) {}

  async findAll(): Promise<ModeratorQueueArticle[]> {
    return this.moderatorQueueArticleModel.find().exec();
  }

  async submitArticle(articleData: any): Promise<ModeratorQueueArticle> {
    const newArticle = new this.moderatorQueueArticleModel(articleData);
    await newArticle.save();
    await this.notificationService.createNotification(
      `A new article titled "${articleData.title}" has been submitted for moderator review.`,
      'submission',
    );
    return newArticle;
  }

  async rejectArticle(id: string): Promise<void> {
    const article = await this.moderatorQueueArticleModel.findById(id).exec();
    if (article) {
      const rejectedArticle = new this.rejectedArticleModel(article.toObject());
      await rejectedArticle.save();
      await this.moderatorQueueArticleModel.findByIdAndDelete(id).exec();

      // Create a notification
      await this.notificationService.createNotification(
        `Your article "${article.title}" has been rejected by the moderator.`,
        'moderation',
      );
    }
  }

  async approveArticle(id: string): Promise<void> {
    const article = await this.moderatorQueueArticleModel.findById(id).exec();
    if (article) {
      const analystArticle = new this.analystQueueArticleModel(article.toObject());
      await analystArticle.save();
      await this.moderatorQueueArticleModel.findByIdAndDelete(id).exec();

      await this.notificationService.createNotification(
      `Your article "${article.title}" has been approved by the moderator and is now under analyst review.`,
      'moderation',
    );

    await this.notificationService.createNotification(
      `The article "${article.title}" is waiting to be checked by you.`,
      'analyst' 
    );
    }
  }
}