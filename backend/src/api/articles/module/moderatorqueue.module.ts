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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModeratorQueueArticle.name, schema: ModeratorQueueArticleSchema },
      { name: RejectedArticle.name, schema: RejectedArticleSchema },
    ]),
  ],
  controllers: [ModeratorQueueController],
  providers: [ModeratorQueueService],
})
export class ModeratorQueueModule {}
