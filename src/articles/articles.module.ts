import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesEntity } from './articles.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesService } from './articles.service';
import { UsersEntity } from '@app/users/users.entity';
import { FollowsEntity } from '@app/profile/follow.entity';
import { CommentsEntity } from './comments.entity';

@Module({
  controllers: [ArticlesController],
  imports: [
    TypeOrmModule.forFeature([
      ArticlesEntity,
      UsersEntity,
      FollowsEntity,
      CommentsEntity,
    ]),
  ],
  providers: [ArticlesService],
})
export class ArticlesModule {}
