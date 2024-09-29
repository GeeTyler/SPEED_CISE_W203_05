import { Module } from '@nestjs/common';
import { ModeratorQueueController } from '../controller/moderatorqueue.controller';
import { ModeratorQueueService } from '../service/moderatorqueue.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ModeratorQueueArticle,
  ModeratorQueueArticleSchema,
} from '../schema/moderatorqueue.schema';
import {
  RejectedArticle,
  RejectedArticleSchema,
} from '../schema/rejected.schema';
import { NotificationService } from '../service/notification.service';
import { Notification, NotificationSchema } from '../schema/notification.schema';

import {
  AnalystQueueArticle,
  AnalystQueueArticleSchema,
} from '../schema/analystqueue.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModeratorQueueArticle.name, schema: ModeratorQueueArticleSchema },
      { name: RejectedArticle.name, schema: RejectedArticleSchema },
      { name: AnalystQueueArticle.name, schema: AnalystQueueArticleSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [ModeratorQueueController],
  providers: [ModeratorQueueService, NotificationService],
})
export class ModeratorQueueModule {}