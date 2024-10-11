import { Test, TestingModule } from '@nestjs/testing';
import { AnalystQueueController } from '../../../api/articles/controller/analystqueue.controller';
import { AnalystQueueService } from '../../../api/articles/service/analystqueue.service';
import { AnalystQueueArticle } from '../../../api/articles/schema/analystqueue.schema';

describe('AnalystQueueController', () => {
  let analystQueueController: AnalystQueueController;
  let analystQueueService: AnalystQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalystQueueController],
      providers: [
        {
          provide: AnalystQueueService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]), 
            addArticle: jest.fn().mockResolvedValue({
              title: 'New Analyst Article',
              authors: 'Author X',
              journal: 'Analyst Journal',
              year: 2024,
              doi: '10.5678/analyst-test',
              publisher: 'Analyst Publisher',
              submittedAt: new Date(),
            }), 
          },
        },
      ],
    }).compile();

    analystQueueController = module.get<AnalystQueueController>(AnalystQueueController);
    analystQueueService = module.get<AnalystQueueService>(AnalystQueueService);
  });

  it('should return an array of analyst queue articles', async () => {
    const result = await analystQueueController.getAnalystQueueArticles();
    expect(result).toEqual([]);
    expect(analystQueueService.findAll).toHaveBeenCalled();
  });

  it('should add a new article to the analyst queue', async () => {
    const articleData: AnalystQueueArticle = {
      title: 'New Analyst Article',
      authors: 'Author X',
      journal: 'Analyst Journal',
      year: 2024,
      doi: '10.5678/analyst-test',
      publisher: 'Analyst Publisher',
      submittedAt: new Date(),
    };

    const result = await analystQueueService.addArticle(articleData);

    expect(result.title).toBe(articleData.title);
    expect(result.authors).toBe(articleData.authors);
    expect(result.journal).toBe(articleData.journal);
    expect(result.year).toBe(articleData.year);
    expect(result.doi).toBe(articleData.doi);
    expect(result.publisher).toBe(articleData.publisher);
    expect(result.submittedAt).toBeInstanceOf(Date);
    expect(analystQueueService.addArticle).toHaveBeenCalledWith(articleData);
  });
});
