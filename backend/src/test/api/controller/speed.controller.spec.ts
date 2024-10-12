import { Test, TestingModule } from '@nestjs/testing';
import { SpeedController } from '../../../api/articles/controller/speed.controller';
import { SpeedService } from '../../../api/articles/service/speed.service';
import { AnalystQueueService } from '../../../api/articles/service/analystqueue.service';
import { SpeedDto } from '../../../api/articles/dto/speed.dto';

describe('SpeedController', () => {
  let speedController: SpeedController;
  let speedService: SpeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpeedController],
      providers: [
        {
          provide: SpeedService,
          useValue: {
            create: jest.fn().mockResolvedValue({
              _id: '1',
              title: 'Sample Article',
              authors: 'Author 1, Author 2',
              journal: 'Sample Journal',
              year: 2024,
              doi: '10.1234/example',
              publisher: 'Sample Publisher',
              submittedAt: new Date(),
              claim: 'Sample Claim',
            }),
            delete: jest.fn().mockResolvedValue(undefined),
            findAll: jest.fn().mockResolvedValue([
              {
                _id: '1',
                title: 'Sample Article',
                authors: 'Author 1, Author 2',
                journal: 'Sample Journal',
                year: 2024,
                doi: '10.1234/example',
                publisher: 'Sample Publisher',
                submittedAt: new Date(),
                claim: 'Sample Claim',
              },
            ]),
            search: jest.fn().mockResolvedValue([
              {
                _id: '1',
                title: 'Sample Article',
                authors: 'Author 1, Author 2',
                journal: 'Sample Journal',
                year: 2024,
                doi: '10.1234/example',
                publisher: 'Sample Publisher',
                submittedAt: new Date(),
                claim: 'Sample Claim',
              },
            ]),
          },
        },
        {
          provide: AnalystQueueService,
          useValue: {
            deleteArticle: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    speedController = module.get<SpeedController>(SpeedController);
    speedService = module.get<SpeedService>(SpeedService);
  });

  it('should create a speed article', async () => {
    const createSpeedDto: SpeedDto = {
      _id: '1',
      title: 'Sample Article',
      authors: 'Author 1, Author 2',
      journal: 'Sample Journal',
      year: 2024,
      doi: '10.1234/example',
      publisher: 'Sample Publisher',
      submittedAt: new Date(),
      claim: 'Sample Claim',
    };
    const result = await speedController.createSpeed(createSpeedDto);

    expect(result).toEqual({
      ...createSpeedDto,
      submittedAt: expect.any(Date),
    });

    expect(speedService.create).toHaveBeenCalledWith(createSpeedDto);
  });

  it('should delete a speed article', async () => {
    const id = '1';
    await speedController.deleteSpeed(id);
    expect(speedService.delete).toHaveBeenCalledWith(id);
  });

  it('should return an array of speed articles', async () => {
    const result = await speedController.getAllSpeed();
    expect(result).toEqual([
      {
        _id: '1',
        title: 'Sample Article',
        authors: 'Author 1, Author 2',
        journal: 'Sample Journal',
        year: 2024,
        doi: '10.1234/example',
        publisher: 'Sample Publisher',
        submittedAt: expect.any(Date),
        claim: 'Sample Claim',
      },
    ]);
    expect(speedService.findAll).toHaveBeenCalled();
  });

  it('should search speed articles', async () => {
    const query = 'Sample';
    const result = await speedController.searchSpeed(query);
    expect(result).toEqual([
      {
        _id: '1',
        title: 'Sample Article',
        authors: 'Author 1, Author 2',
        journal: 'Sample Journal',
        year: 2024,
        doi: '10.1234/example',
        publisher: 'Sample Publisher',
        submittedAt: expect.any(Date),
        claim: 'Sample Claim',
      },
    ]);
    expect(speedService.search).toHaveBeenCalledWith(query);
  });
});
