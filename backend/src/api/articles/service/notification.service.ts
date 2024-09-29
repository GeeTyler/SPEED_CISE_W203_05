import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification, NotificationDocument } from '../schema/notification.schema';
import { Model } from 'mongoose';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async createNotification(message: string, type: string): Promise<Notification> {
    const newNotification = new this.notificationModel({ message, type });
    return newNotification.save();
  }

  async findAll(type?: string): Promise<Notification[]> {
    const filter = type ? { type } : {};
    return this.notificationModel.find(filter).sort({ createdAt: -1 }).exec();
  }
}
