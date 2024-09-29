import { Test, TestingModule } from '@nestjs/testing';
import { RejectedController } from '../../../api/articles/controller/rejected.controller';
import { RejectedService } from '../../../api/articles/service/rejected.service';

describe('RejectedController', () => {
  let rejectedController: RejectedController;
  let rejectedService: RejectedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RejectedController],
      providers: [
        {
          provide: RejectedService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              {
                title: 'Sample Article',
                authors: 'Author 1, Author 2',
                journal: 'Sample Journal',
                year: 2024,
                doi: '10.1234/example',
                publisher: 'Sample Publisher',
                submittedAt: new Date(),
              },
            ]),
          },
        },
      ],
    }).compile();

    rejectedController = module.get<RejectedController>(RejectedController);
    rejectedService = module.get<RejectedService>(RejectedService);
  });

  it('should return an array of rejected articles', async () => {
    const result = await rejectedController.getRejectedArticles();
    expect(result).toEqual([
      {
        title: 'Sample Article',
        authors: 'Author 1, Author 2',
        journal: 'Sample Journal',
        year: 2024,
        doi: '10.1234/example',
        publisher: 'Sample Publisher',
        submittedAt: expect.any(Date),
      },
    ]);
    expect(rejectedService.findAll).toHaveBeenCalled();
  });
});
