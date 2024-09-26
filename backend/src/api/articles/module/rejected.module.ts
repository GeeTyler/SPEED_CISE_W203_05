import { Module } from '@nestjs/common';
import { RejectedController } from '../controller/rejected.controller';
import { RejectedService } from '../service/rejected.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RejectedArticle,
  RejectedArticleSchema,
} from '../schema/rejected.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RejectedArticle.name, schema: RejectedArticleSchema },
    ]),
  ],
  controllers: [RejectedController],
  providers: [RejectedService],
})
export class RejectedModule {}
