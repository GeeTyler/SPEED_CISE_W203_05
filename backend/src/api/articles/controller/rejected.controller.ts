import { Controller, Get } from '@nestjs/common';
import { RejectedService } from '../service/rejected.service';

@Controller('api/rejected-articles')
export class RejectedController {
  constructor(private readonly rejectedService: RejectedService) {}

  @Get()
  async getRejectedArticles() {
    return this.rejectedService.findAll();
  }
}
