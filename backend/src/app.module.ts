import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ModeratorQueueModule } from './api/articles/module/moderatorqueue.module';
import { RejectedModule } from './api/articles/module/rejected.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    ModeratorQueueModule,
    RejectedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
