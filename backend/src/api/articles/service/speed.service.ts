import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SpeedArticle, SpeedArticleDocument } from '../schema/speed.schema';
import { SpeedDto } from '../dto/speed.dto';
import { levenshtein } from '../../../utils/levenshtein';

type SpeedArticleWithRating = SpeedArticle & { averageRating: number | null };

@Injectable()
export class SpeedService {
  constructor(
    @InjectModel(SpeedArticle.name)
    private speedModel: Model<SpeedArticleDocument>,
  ) {}

  // Create a new article
  async create(createSpeedDto: SpeedDto): Promise<SpeedArticle> {
    const createdSpeed = new this.speedModel(createSpeedDto);
    return createdSpeed.save();
  }

  // Delete an article by ID
  async delete(id: string): Promise<void> {
    const result = await this.speedModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Article not found');
    }
  }

  // Find all articles and include average rating
  async findAll(): Promise<SpeedArticleWithRating[]> {
    const articles = await this.speedModel.find().exec();
    return articles.map((article) => ({
      ...article.toObject(),
      averageRating: this.calculateAverageRating(article),
    }));
  }

  // Find an article by ID and include average rating
  async findById(id: string): Promise<SpeedArticleWithRating> {
    const article = await this.speedModel.findById(id).exec();
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return {
      ...article.toObject(),
      averageRating: this.calculateAverageRating(article),
    };
  }

  // Update an article by ID
  async update(
    id: string,
    updateSpeedDto: SpeedDto,
  ): Promise<SpeedArticleWithRating> {
    const updatedArticle = await this.speedModel
      .findByIdAndUpdate(id, updateSpeedDto, { new: true })
      .exec();
    if (!updatedArticle) {
      throw new NotFoundException('Article not found');
    }
    return {
      ...updatedArticle.toObject(),
      averageRating: this.calculateAverageRating(updatedArticle),
    };
  }

  // Add a rating to an article
  async addRating(
    articleId: string,
    rating: number,
  ): Promise<SpeedArticleWithRating> {
    const article = await this.speedModel.findById(articleId).exec();
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Add the new rating to the ratings array
    article.ratings.push(rating);
    await article.save();

    return {
      ...article.toObject(),
      averageRating: this.calculateAverageRating(article),
    };
  }

  // Calculate the average rating of an article
  private calculateAverageRating(
    article: SpeedArticleDocument,
  ): number | null {
    if (!article.ratings || article.ratings.length === 0) {
      return null;
    }
    const sum = article.ratings.reduce((acc, r) => acc + r, 0);
    return parseFloat((sum / article.ratings.length).toFixed(1));
  }

  // Search for articles based on a query and include average rating
  async search(query: string): Promise<SpeedArticleWithRating[]> {
    const matchedArticles = await this.searchArticles(query);
    return matchedArticles.map((article) => ({
      ...article.toObject(),
      averageRating: this.calculateAverageRating(article),
    }));
  }

  // Helper method for search logic
  private async searchArticles(
    query: string,
  ): Promise<SpeedArticleDocument[]> {
    const articles = await this.speedModel.find().exec();

    // If no query is provided, return all articles
    if (!query) {
      return articles;
    }

    const lowerCaseQuery = query.toLowerCase();
    const matchedArticles: SpeedArticleDocument[] = [];

    for (const article of articles) {
      const fields = [
        article.title || '',
        article.authors || '',
        article.journal || '',
        article.doi || '',
        article.publisher || '',
      ];

      let isMatched = false;

      // Check for substring matches
      for (const field of fields) {
        if (field.toLowerCase().includes(lowerCaseQuery)) {
          isMatched = true;
          break;
        }
      }

      // If substring match is found, add to matched articles
      if (isMatched) {
        matchedArticles.push(article);
        continue;
      }

      // If no substring match, use Levenshtein distance for fuzzy matching
      const distances = fields.map((field) => {
        if (!field) return Infinity;
        return levenshtein(field.toLowerCase(), lowerCaseQuery);
      });

      const minDistance = Math.min(...distances);
      const dynamicThreshold = Math.ceil(lowerCaseQuery.length * 0.3);

      if (minDistance <= dynamicThreshold) {
        matchedArticles.push(article);
      }
    }

    return matchedArticles;
  }

  // Find the latest articles and include average rating
  async findLatest(): Promise<SpeedArticleWithRating[]> {
    const articles = await this.speedModel
      .find()
      .sort({ submittedAt: -1 })
      .limit(3)
      .exec();
    return articles.map((article) => ({
      ...article.toObject(),
      averageRating: this.calculateAverageRating(article),
    }));
  }
}
