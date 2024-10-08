import { Controller, Get, Query } from '@nestjs/common';
import { NotificationService } from '../service/notification.service';

@Controller('api/notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getNotifications(@Query('type') type: string) {
    return this.notificationService.findAll(type);
  }
}
