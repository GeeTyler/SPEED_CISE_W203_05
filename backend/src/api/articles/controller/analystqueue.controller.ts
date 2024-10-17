import { Controller, Get, Param } from '@nestjs/common';
import { AnalystQueueService } from '../service/analystqueue.service';

@Controller('api/analyst-queue-articles')
export class AnalystQueueController {
  constructor(private readonly analystQueueService: AnalystQueueService) {}

  @Get()
  async getAnalystQueueArticles() {
    return this.analystQueueService.findAll();
  }

  @Get(':id')
  async getAnalystQueueArticleById(@Param('id') id: string) {
    return this.analystQueueService.findById(id);
  }
}
