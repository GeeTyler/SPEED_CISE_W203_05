import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from '../schema/article.schema';
import { CreateRatingDto } from '../dto/article.dto';

@Injectable()
export class ArticleService {
  constructor(@InjectModel(Article.name) private articleModel: Model<ArticleDocument>) {}

  async searchArticles(method: string, startYear: number, endYear: number): Promise<Article[]> {
    // Example: replace this with your own search criteria
    return this.articleModel.find({
      createdAt: { $gte: new Date(startYear, 0, 1), $lte: new Date(endYear, 11, 31) },
    }).exec();
  }

  async getArticleById(id: string): Promise<ArticleDocument> { // Return ArticleDocument
    const article = await this.articleModel.findById(id).exec();
    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }
    return article; // ArticleDocument type has the save method
  }

  async rateArticle(id: string, rating: number): Promise<void> {
    const article = await this.getArticleById(id); // Ensure the article exists
    article.ratings.push(rating); // Assuming you have a ratings array in your schema
    await article.save(); // Now this should work without error
  }
}
