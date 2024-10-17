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

  async search(
    query: string,
    page = 1,
    limit = 5,
  ): Promise<{ articles: SpeedArticle[]; total: number }> {
    const skip = (page - 1) * limit;

    // Fetch all articles
    const articles = await this.findAll();

    // if query field is null fetch all articles
    if (!query) {
      const total = articles.length;
      const paginatedArticles = articles.slice(skip, skip + limit);
      return { articles: paginatedArticles, total };
    }


    const lowerCaseQuery = query.toLowerCase();
    const matchedArticles = [];

    // filter articles based on substring match or fuzzy search
    for (const article of articles) {
      const fields = [
        article.title || '',
        article.authors || '',
        article.journal || '',
        article.doi || '',
        article.publisher || '',
        article.claim || '',
      ];

      let isMatched = false;

      // first we check for substring matches
      for (const field of fields) {
        if (field.toLowerCase().includes(lowerCaseQuery)) {
          isMatched = true;
          break;
        }
      }

      // if substring match found, add to matched articles
      if (isMatched) {
        matchedArticles.push({ article, score: 0 }); // Score 0 for exact match
        continue;
      }

      // If no substring match, use Levenshtein distance
      const distances = fields.map((field) => {
        if (!field) return Infinity;
        return levenshtein(field.toLowerCase(), lowerCaseQuery);
      });

      const minDistance = Math.min(...distances);
      const dynamicThreshold = Math.ceil(lowerCaseQuery.length * 0.3);

      if (minDistance <= dynamicThreshold) {
        matchedArticles.push({ article, score: minDistance });
      }
    }

    matchedArticles.sort((a, b) => a.score - b.score);

    const total = matchedArticles.length;

    // Apply pagination
    const paginatedArticles = matchedArticles
      .slice(skip, skip + limit)
      .map(({ article }) => article);

    return { articles: paginatedArticles, total };
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
