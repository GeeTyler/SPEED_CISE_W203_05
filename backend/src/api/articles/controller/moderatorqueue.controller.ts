import { Controller, Get, Patch, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ModeratorQueueService } from '../service/moderatorqueue.service';
import { ModeratorQueueArticle } from '../schema/moderatorqueue.schema';

@Controller('api/moderator-queue-articles')
export class ModeratorQueueController {
  constructor(private readonly moderatorQueueService: ModeratorQueueService) {}

  @Get()
  async getModeratorQueueArticles() {
    return this.moderatorQueueService.findAll();
  }

  @Post()
  async submitArticle(@Body() article: ModeratorQueueArticle) {
    return this.moderatorQueueService.submitArticle(article);
  }

  @Patch('/:id/reject')
  async rejectArticle(@Param('id') id: string) {
    try {
      await this.moderatorQueueService.rejectArticle(id);
      return { message: 'Article rejected successfully' };
    } catch (error) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }
  }

  @Patch('/:id/approve')
  async approveArticle(@Param('id') id: string) {
    try {
      await this.moderatorQueueService.approveArticle(id);
      return { message: 'Article approved successfully' };
    } catch (error) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }
  }
}
