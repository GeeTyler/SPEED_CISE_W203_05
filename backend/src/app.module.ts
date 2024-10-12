import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ModeratorQueueModule } from './api/articles/module/moderatorqueue.module';
import { RejectedModule } from './api/articles/module/rejected.module';
import { AnalystQueueModule } from './api/articles/module/analystqueue.module';
import { NotificationModule } from './api/articles/module/notification.module';
import { ArticleModule } from './api/articles/module/article.module'; // Import ArticleModule
import { SpeedModule } from './api/articles/module/speed.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    ModeratorQueueModule,
    RejectedModule,
    AnalystQueueModule,
    NotificationModule,
    ArticleModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
