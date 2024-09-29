import { Module } from '@nestjs/common';
import { AnalystQueueController } from '../controller/analystqueue.controller';
import { AnalystQueueService } from '../service/analystqueue.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalystQueueArticle, AnalystQueueArticleSchema } from '../schema/analystqueue.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AnalystQueueArticle.name, schema: AnalystQueueArticleSchema },
    ]),
  ],
  controllers: [AnalystQueueController],
  providers: [AnalystQueueService],
})
export class AnalystQueueModule {}
