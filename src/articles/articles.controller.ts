import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { AuthGuard } from '@app/guards/auth.guard';
import { UserDecoratar } from '@app/decorators/user.decorators';
import { UsersEntity } from '@app/users/users.entity';
import { ArticlesEntity } from './articles.entity';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}
  @Post()
  @UseGuards(AuthGuard)
  async createArticle(
    @UserDecoratar() currentUser: UsersEntity,
    @Body('article') createArticleDto: ArticlesEntity,
  ): Promise<any> {
    return this.articlesService.createArticle(currentUser, createArticleDto);
  }
}
