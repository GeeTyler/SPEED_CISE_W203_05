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
import { SpeedArticle } from '../schema/speed.schema';

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

  @Get('latest')
  async getLatest(): Promise<SpeedArticle[]> {
    return this.speedService.findLatest();
  }

  @Get('search')
  async searchSpeed(
    @Query('q') query: string,
    @Query('page') page = '1',
    @Query('limit') limit = '5',
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return this.speedService.search(query, pageNumber, limitNumber);
  }

  @Put(':id')
  async updateSpeed(@Param('id') id: string, @Body() updateSpeedDto: SpeedDto) {
    return this.speedService.update(id, updateSpeedDto);
  }

  @Get(':id')
  async getSpeedById(@Param('id') id: string): Promise<SpeedArticle> {
    return await this.speedService.findById(id);
  }
}
