import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SpeedArticle, SpeedArticleDocument } from '../schema/speed.schema';
import { SpeedDto } from '../dto/speed.dto';
import { levenshtein } from '../../../utils/levenshtein';

@Injectable()
export class SpeedService {
  constructor(
    @InjectModel(SpeedArticle.name)
    private speedModel: Model<SpeedArticleDocument>,
  ) {}

  async create(createSpeedDto: SpeedDto): Promise<SpeedArticle> {
    const createdSpeed = new this.speedModel(createSpeedDto);
    return createdSpeed.save();
  }

  async delete(id: string): Promise<void> {
    const result = await this.speedModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Article not found');
    }
  }

  async findAll(): Promise<SpeedArticle[]> {
    return this.speedModel.find().exec();
  }

  async search(query: string): Promise<SpeedArticle[]> {
    const articles = await this.findAll();
    if (!query) {
      return articles;
    }

    const threshold = 3;
    return articles.filter((article) => {
      const fields = [
        article.title,
        article.authors,
        article.journal,
        article.doi,
        article.publisher,
        article.claim,
      ];
      return fields.some((field) => levenshtein(field, query) <= threshold);
    });
  }

  async update(id: string, updateSpeedDto: SpeedDto): Promise<SpeedArticle> {
    const updatedArticle = await this.speedModel
      .findByIdAndUpdate(id, updateSpeedDto, { new: true })
      .exec();
    if (!updatedArticle) {
      throw new NotFoundException('Article not found');
    }
    return updatedArticle;
  }
}
