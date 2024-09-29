import { Controller, Get } from '@nestjs/common';
import { NotificationService } from '../service/notification.service';

@Controller('api/notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getNotifications() {
    return this.notificationService.findAll();
  }
}
