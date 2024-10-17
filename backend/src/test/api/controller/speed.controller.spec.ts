import { Test, TestingModule } from '@nestjs/testing';
import { SpeedController } from '../../../api/articles/controller/speed.controller';
import { SpeedService } from '../../../api/articles/service/speed.service';
import { SpeedDto } from '../../../api/articles/dto/speed.dto';
import { RateArticleDto } from '../../../api/articles/dto/rate-article.dto';
import { AnalystQueueService } from '../../../api/articles/service/analystqueue.service';

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
                averageRating: 4.5, // Include averageRating
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
                averageRating: 4.5, // Include averageRating
              },
            ]),
            update: jest.fn().mockResolvedValue({
              _id: '1',
              title: 'Updated Article',
              authors: 'Author 1, Author 2',
              journal: 'Updated Journal',
              year: 2024,
              doi: '10.1234/updated',
              publisher: 'Updated Publisher',
              submittedAt: new Date(),
              claim: 'Updated Claim',
            }),
            // Mock implementations for the new methods
            findLatest: jest.fn().mockResolvedValue([
              {
                _id: '2',
                title: 'Latest Article',
                authors: 'Author 3, Author 4',
                journal: 'Latest Journal',
                year: 2025,
                doi: '10.1234/latest',
                publisher: 'Latest Publisher',
                submittedAt: new Date(),
                claim: 'Latest Claim',
                averageRating: 4.0,
              },
            ]),
            addRating: jest.fn().mockResolvedValue({
              _id: '1',
              title: 'Sample Article',
              authors: 'Author 1, Author 2',
              journal: 'Sample Journal',
              year: 2024,
              doi: '10.1234/example',
              publisher: 'Sample Publisher',
              submittedAt: new Date(),
              claim: 'Sample Claim',
              ratings: [5],
              averageRating: 5.0,
            }),
            findById: jest.fn().mockResolvedValue({
              _id: '1',
              title: 'Sample Article',
              authors: 'Author 1, Author 2',
              journal: 'Sample Journal',
              year: 2024,
              doi: '10.1234/example',
              publisher: 'Sample Publisher',
              submittedAt: new Date(),
              claim: 'Sample Claim',
              averageRating: 4.5,
            }),
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
        averageRating: 4.5, 
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
        averageRating: 4.5, // Include averageRating
      },
    ]);
    expect(speedService.search).toHaveBeenCalledWith(query);
  });

    // Test for rateArticle method
  it('should rate an article', async () => {
    const articleId = '1';
    const rateArticleDto: RateArticleDto = {
      rating: 5,
    };

    const result = await speedController.rateArticle(articleId, rateArticleDto);

    expect(result).toEqual({
      _id: '1',
      title: 'Sample Article',
      authors: 'Author 1, Author 2',
      journal: 'Sample Journal',
      year: 2024,
      doi: '10.1234/example',
      publisher: 'Sample Publisher',
      submittedAt: expect.any(Date),
      claim: 'Sample Claim',
      ratings: [5],
      averageRating: 5.0,
    });

    expect(speedService.addRating).toHaveBeenCalledWith(articleId, rateArticleDto.rating);
  });

  // Test for getSpeedById method
  it('should get a speed article by id', async () => {
    const id = '1';
  
    const result = await speedController.getSpeedById(id);
  
    expect(result).toEqual({
      _id: '1',
      title: 'Sample Article',
      authors: 'Author 1, Author 2',
      journal: 'Sample Journal',
      year: 2024,
      doi: '10.1234/example',
      publisher: 'Sample Publisher',
      submittedAt: expect.any(Date),
      claim: 'Sample Claim',
      averageRating: 4.5, 
    });
  
    expect(speedService.findById).toHaveBeenCalledWith(id);
  });
  

    // Test for rateArticle method
  it('should rate an article', async () => {
    const articleId = '1';
    const rateArticleDto: RateArticleDto = {
      rating: 5,
    };

    const result = await speedController.rateArticle(articleId, rateArticleDto);

    expect(result).toEqual({
      _id: '1',
      title: 'Sample Article',
      authors: 'Author 1, Author 2',
      journal: 'Sample Journal',
      year: 2024,
      doi: '10.1234/example',
      publisher: 'Sample Publisher',
      submittedAt: expect.any(Date),
      claim: 'Sample Claim',
      ratings: [5],
      averageRating: 5.0,
    });

    expect(speedService.addRating).toHaveBeenCalledWith(articleId, rateArticleDto.rating);
  });

  // Test for getSpeedById method
  it('should get a speed article by id', async () => {
    const id = '1';

    const result = await speedController.getSpeedById(id);

    expect(result).toEqual({
      _id: '1',
      title: 'Sample Article',
      authors: 'Author 1, Author 2',
      journal: 'Sample Journal',
      year: 2024,
      doi: '10.1234/example',
      publisher: 'Sample Publisher',
      submittedAt: expect.any(Date),
      claim: 'Sample Claim',
      averageRating: 4.5,
    });

    expect(speedService.findById).toHaveBeenCalledWith(id);
  });

  it('should get the latest speed articles', async () => {
    const result = await speedController.getLatest();

    expect(result).toEqual([
      {
        _id: '2',
        title: 'Latest Article',
        authors: 'Author 3, Author 4',
        journal: 'Latest Journal',
        year: 2025,
        doi: '10.1234/latest',
        publisher: 'Latest Publisher',
        submittedAt: expect.any(Date), // Use expect.any(Date) for dynamic date values
        claim: 'Latest Claim',
        averageRating: 4.0,
      },
    ]);

    expect(speedService.findLatest).toHaveBeenCalled();
  });

  // Test for rateArticle method
  it('should rate an article', async () => {
    const articleId = '1';
    const rateArticleDto: RateArticleDto = {
      rating: 5,
    };

    const result = await speedController.rateArticle(articleId, rateArticleDto);

    expect(result).toEqual({
      _id: '1',
      title: 'Sample Article',
      authors: 'Author 1, Author 2',
      journal: 'Sample Journal',
      year: 2024,
      doi: '10.1234/example',
      publisher: 'Sample Publisher',
      submittedAt: expect.any(Date),
      claim: 'Sample Claim',
      ratings: [5],
      averageRating: 5.0,
    });

    expect(speedService.addRating).toHaveBeenCalledWith(articleId, rateArticleDto.rating);
  });

  // Test for getSpeedById method
  it('should get a speed article by id', async () => {
    const id = '1';

    const result = await speedController.getSpeedById(id);

    expect(result).toEqual({
      _id: '1',
      title: 'Sample Article',
      authors: 'Author 1, Author 2',
      journal: 'Sample Journal',
      year: 2024,
      doi: '10.1234/example',
      publisher: 'Sample Publisher',
      submittedAt: expect.any(Date),
      claim: 'Sample Claim',
      averageRating: 4.5,
    });

    expect(speedService.findById).toHaveBeenCalledWith(id);
  });

  it('should update a speed article', async () => {
    const updateSpeedDto: SpeedDto = {
      _id: '1',
      title: 'Updated Article',
      authors: 'Author 1, Author 2',
      journal: 'Updated Journal',
      year: 2024,
      doi: '10.1234/updated',
      publisher: 'Updated Publisher',
      submittedAt: new Date(),
      claim: 'Updated Claim',
    };
    const result = await speedController.updateSpeed('1', updateSpeedDto);

    expect(result).toEqual({
      ...updateSpeedDto,
      submittedAt: expect.any(Date),
    });

    expect(speedService.update).toHaveBeenCalledWith('1', updateSpeedDto);
  });
});