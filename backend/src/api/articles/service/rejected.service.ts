import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  RejectedArticle,
  RejectedArticleDocument,
} from '../schema/rejected.schema';

@Injectable()
export class RejectedService {
  constructor(
    @InjectModel(RejectedArticle.name)
    private rejectedArticleModel: Model<RejectedArticleDocument>,
  ) {}

  async findAll(): Promise<RejectedArticle[]> {
    return this.rejectedArticleModel.find().exec();
  }
}
