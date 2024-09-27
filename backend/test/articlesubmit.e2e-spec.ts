import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('ArticleController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/moderator-queue-articles (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/moderator-queue-articles')
      .send({
        title: 'Test Article',
        authors: 'John Doe',
        journal: 'Test Journal',
        year: 2023,
        doi: '10.1234/test',
        publisher: 'Test Publisher',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.title).toBe('Test Article');
      });
  });
});
