import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpeedController } from '../controller/speed.controller';
import { SpeedService } from '../service/speed.service';
import { AnalystQueueService } from '../service/analystqueue.service';
import {
  AnalystQueueArticle,
  AnalystQueueArticleSchema,
} from '../schema/analystqueue.schema';
import { SpeedArticle, SpeedArticleSchema } from '../schema/speed.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AnalystQueueArticle.name, schema: AnalystQueueArticleSchema },
      { name: SpeedArticle.name, schema: SpeedArticleSchema },
    ]),
  ],
  controllers: [SpeedController],
  providers: [SpeedService, AnalystQueueService],
})
export class SpeedModule {}
