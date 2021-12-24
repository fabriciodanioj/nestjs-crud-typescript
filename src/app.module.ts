import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesModule } from './articles/articles.module';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    ArticlesModule,
    MongooseModule.forRoot(
      'mongodb+srv://admin:admin@dev.z8zxv.mongodb.net/nest',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
