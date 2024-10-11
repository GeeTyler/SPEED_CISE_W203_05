import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from '../../../api/articles/controller/notification.controller';
import { NotificationService } from '../../../api/articles/service/notification.service';

describe('NotificationController', () => {
  let notificationController: NotificationController;
  let notificationService: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        {
          provide: NotificationService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    notificationController = module.get<NotificationController>(NotificationController);
    notificationService = module.get<NotificationService>(NotificationService);
  });

  it('should return an array of notifications', async () => {
    const result = await notificationController.getNotifications('');
    expect(result).toEqual([]);
    expect(notificationService.findAll).toHaveBeenCalledWith('');
  });

  it('should pass the "type" query to the service', async () => {
    const type = 'error';
    const result = await notificationController.getNotifications(type);
    expect(result).toEqual([]);
    expect(notificationService.findAll).toHaveBeenCalledWith(type);
  });
});
