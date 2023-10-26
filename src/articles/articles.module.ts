import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesEntity } from './articles.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesService } from './articles.service';
import { UsersEntity } from '@app/users/users.entity';

@Module({
  controllers: [ArticlesController],
  imports: [TypeOrmModule.forFeature([ArticlesEntity, UsersEntity])],
  providers: [ArticlesService],
})
export class ArticlesModule {}
