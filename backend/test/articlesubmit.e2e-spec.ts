import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Model, Connection } from 'mongoose';
import {
  ModeratorQueueArticle,
  ModeratorQueueArticleDocument,
} from '../src/api/articles/schema/moderatorqueue.schema';

describe('ArticleController (e2e)', () => {
  let app: INestApplication;
  let articleModel: Model<ModeratorQueueArticleDocument>;
  let connection: Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    articleModel = moduleFixture.get<Model<ModeratorQueueArticleDocument>>(
      getModelToken(ModeratorQueueArticle.name),
    );
    connection = moduleFixture.get<Connection>('DatabaseConnection');
    await app.init();
  });

  afterEach(async () => {
    await articleModel.deleteMany({ title: 'Test Article' });
  });

  afterAll(async () => {
    await app.close();
    await connection.close();
    await mongoose.disconnect(); // Ensures all connections are closed
  });

  it('/api/moderator-queue-articles (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/moderator-queue-articles')
      .send({
        title: 'Test Article',
        authors: 'John Doe',
        journal: 'Test Journal',
        year: 2023,
        doi: '10.1234/test',
        publisher: 'Test Publisher',
      });
    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Test Article');
  });

  afterAll(async () => {
    await app.close();
  });
});
