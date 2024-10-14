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

  async findLatest(): Promise<SpeedArticle[]> {
    return this.speedModel.find().sort({ submittedAt: -1 }).limit(3).exec();
  }

  async findById(id: string): Promise<SpeedArticle> {
    const article = await this.speedModel.findById(id).exec();
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  async findByDoi(doi: string): Promise<SpeedArticle[]> {
    return this.speedModel.find({ doi }).exec();
  }

  async search(query: string): Promise<SpeedArticle[]> {
    if (!query) {
      return this.findAll();
    }
    
    // If you're looking for a specific DOI match:
    const articlesByDoi = await this.findByDoi(query);
    if (articlesByDoi.length > 0) {
      return articlesByDoi; // Return articles that match the DOI
    }

    // Fallback to fuzzy search using Levenshtein distance for other fields
    const articles = await this.findAll();
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
