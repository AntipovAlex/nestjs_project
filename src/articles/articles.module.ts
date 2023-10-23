import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesEntity } from './articles.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesService } from './articles.service';

@Module({
  controllers: [ArticlesController],
  imports: [TypeOrmModule.forFeature([ArticlesEntity])],
  providers: [ArticlesService],
})
export class ArticlesModule {}
