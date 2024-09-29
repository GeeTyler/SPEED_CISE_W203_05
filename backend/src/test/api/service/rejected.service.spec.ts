import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { RejectedService } from '../../../api/articles/service/rejected.service';
import { Model } from 'mongoose';
import { RejectedArticleDocument } from '../../../api/articles/schema/rejected.schema';

const mockRejectedArticle = {
  title: 'Sample Article',
  authors: 'Author 1, Author 2',
  journal: 'Sample Journal',
  year: 2024,
  doi: '10.1234/example',
  publisher: 'Sample Publisher',
  submittedAt: new Date(),
};

describe('RejectedService', () => {
  let service: RejectedService;
  let model: Model<RejectedArticleDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RejectedService,
        {
          provide: getModelToken('RejectedArticle'),
          useValue: {
            find: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue([mockRejectedArticle]),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<RejectedService>(RejectedService);
    model = module.get<Model<RejectedArticleDocument>>(getModelToken('RejectedArticle'));
  });

  it('should find and return all rejected articles', async () => {
    const articles = await service.findAll();
    expect(articles).toEqual([mockRejectedArticle]);
    expect(model.find).toHaveBeenCalled();
  });
});