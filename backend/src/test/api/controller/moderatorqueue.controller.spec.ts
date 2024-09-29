import { Test, TestingModule } from '@nestjs/testing';
import { ModeratorQueueController } from '../../../api/articles/controller/moderatorqueue.controller';
import { ModeratorQueueService } from '../../../api/articles/service/moderatorqueue.service';
import { ModeratorQueueArticle } from '../../../api/articles/schema/moderatorqueue.schema';

describe('ModeratorQueueController', () => {
  let moderatorQueueController: ModeratorQueueController;
  let moderatorQueueService: ModeratorQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModeratorQueueController],
      providers: [
        {
          provide: ModeratorQueueService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            submitArticle: jest.fn().mockResolvedValue({
              title: 'Test Article',
              authors: 'Author 1',
              journal: 'Test Journal',
              year: 2024,
              doi: '10.1234/test',
              publisher: 'Test Publisher',
              submittedAt: new Date(), // Mock Date object
            }),
            rejectArticle: jest.fn().mockResolvedValue(undefined),
            approveArticle: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    moderatorQueueController = module.get<ModeratorQueueController>(ModeratorQueueController);
    moderatorQueueService = module.get<ModeratorQueueService>(ModeratorQueueService);
  });

  it('should return an array of moderator queue articles', async () => {
    const result = await moderatorQueueController.getModeratorQueueArticles();
    expect(result).toEqual([]);
    expect(moderatorQueueService.findAll).toHaveBeenCalled();
  });

  it('should submit a new article', async () => {
    const newArticle: ModeratorQueueArticle = {
      title: 'Test Article',
      authors: 'Author 1',
      journal: 'Test Journal',
      year: 2024,
      doi: '10.1234/test',
      publisher: 'Test Publisher',
      submittedAt: new Date() as any,
    };
    const result = await moderatorQueueController.submitArticle(newArticle);

    // Check individual properties and handle `submittedAt` separately
    expect(result.title).toBe(newArticle.title);
    expect(result.authors).toBe(newArticle.authors);
    expect(result.journal).toBe(newArticle.journal);
    expect(result.year).toBe(newArticle.year);
    expect(result.doi).toBe(newArticle.doi);
    expect(result.publisher).toBe(newArticle.publisher);
    expect(result.submittedAt).toBeInstanceOf(Date);


    expect(moderatorQueueService.submitArticle).toHaveBeenCalledWith(newArticle);
  });

  it('should reject an article', async () => {
    const id = 'article123';
    const result = await moderatorQueueController.rejectArticle(id);
    expect(result).toEqual({ message: 'Article rejected successfully' });
    expect(moderatorQueueService.rejectArticle).toHaveBeenCalledWith(id);
  });

  it('should approve an article', async () => {
    const id = 'article123';
    const result = await moderatorQueueController.approveArticle(id);
    expect(result).toEqual({ message: 'Article approved successfully' });
    expect(moderatorQueueService.approveArticle).toHaveBeenCalledWith(id);
  });

  it('should throw an exception if the article is not found for rejection', async () => {
    jest.spyOn(moderatorQueueService, 'rejectArticle').mockRejectedValueOnce(new Error('Article not found'));
    try {
      await moderatorQueueController.rejectArticle('article123');
    } catch (error) {
      expect(error.response).toBe('Article not found');
      expect(error.status).toBe(404);
    }
  });

  it('should throw an exception if the article is not found for approval', async () => {
    jest.spyOn(moderatorQueueService, 'approveArticle').mockRejectedValueOnce(new Error('Article not found'));
    try {
      await moderatorQueueController.approveArticle('article123');
    } catch (error) {
      expect(error.response).toBe('Article not found');
      expect(error.status).toBe(404);
    }
  });
});
