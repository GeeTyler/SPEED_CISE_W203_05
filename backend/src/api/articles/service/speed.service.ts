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

    // Convert query to lowercase for case-insensitive comparison
    const lowerCaseQuery = query.toLowerCase();

    // Fetch all articles
    const articles = await this.findAll();

    // Filter articles based on substring match or fuzzy search
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

      // Check if any field contains the query as a substring
      const containsQuery = fields.some((field) =>
        field.toLowerCase().includes(lowerCaseQuery),
      );

      // Check if any field matches the query using Levenshtein distance
      const fuzzyMatch = fields.some(
        (field) =>
          levenshtein(field.toLowerCase(), lowerCaseQuery) <= threshold,
      );

      return containsQuery || fuzzyMatch;
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
