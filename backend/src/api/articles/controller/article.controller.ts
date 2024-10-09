import { Controller, Get, Post, Param, Query, Body, NotFoundException, BadRequestException } from '@nestjs/common';
import { ArticleService } from '../service/article.service';
import { CreateRatingDto } from '../dto/article.dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async searchArticles(@Query('method') method: string, @Query('startYear') startYear: string, @Query('endYear') endYear: string) {
    const articles = await this.articleService.searchArticles(method, parseInt(startYear), parseInt(endYear));
    
    if (articles.length === 0) {
      throw new NotFoundException('No articles found');
    }
    
    return articles;
  }

  @Get(':id')
  async getArticle(@Param('id') id: string) {
    const article = await this.articleService.getArticleById(id); // Pass id (string)
    
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    
    return article;
  }

  @Post(':id/rating')
  async rateArticle(@Param('id') id: string, @Body() createRatingDto: CreateRatingDto) {
    const { rating } = createRatingDto;
    
    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    await this.articleService.rateArticle(id, rating); // Pass id (string)
    return { message: 'Rating submitted successfully' };
  }
}
