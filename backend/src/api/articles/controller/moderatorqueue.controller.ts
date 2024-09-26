import { Controller, Get, Patch, Post, Body, Param } from '@nestjs/common';
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
    return this.moderatorQueueService.rejectArticle(id);
  }
}
