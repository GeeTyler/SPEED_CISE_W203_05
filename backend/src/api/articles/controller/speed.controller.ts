import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  Get,
  Query,
  Put,
} from '@nestjs/common';
import { SpeedService } from '../service/speed.service';
import { SpeedDto } from '../dto/speed.dto';
import { AnalystQueueService } from '../service/analystqueue.service';

@Controller('api/speed')
export class SpeedController {
  constructor(
    private readonly speedService: SpeedService,
    private readonly analystQueueService: AnalystQueueService,
  ) {}

  @Post()
  async createSpeed(@Body() createSpeedDto: SpeedDto) {
    const speed = await this.speedService.create(createSpeedDto);
    await this.analystQueueService.deleteArticle(createSpeedDto._id);
    return speed;
  }

  @Delete(':id')
  async deleteSpeed(@Param('id') id: string) {
    return this.speedService.delete(id);
  }

  @Get()
  async getAllSpeed() {
    return this.speedService.findAll();
  }

  @Get('search')
  async searchSpeed(@Query('q') query: string) {
    return this.speedService.search(query);
  }

  @Put(':id')
  async updateSpeed(@Param('id') id: string, @Body() updateSpeedDto: SpeedDto) {
    return this.speedService.update(id, updateSpeedDto);
  }
}
