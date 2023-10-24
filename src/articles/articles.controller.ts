import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { AuthGuard } from '@app/guards/auth.guard';
import { UserDecoratar } from '@app/decorators/user.decorators';
import { UsersEntity } from '@app/users/users.entity';
import { ArticlesEntity } from './articles.entity';
import { ArticlesResponse } from './articles.types';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}
  @Post()
  @UseGuards(AuthGuard)
  async createArticle(
    @UserDecoratar() currentUser: UsersEntity,
    @Body('article') createArticleDto: ArticlesEntity,
  ): Promise<ArticlesResponse> {
    const article = await this.articlesService.createArticle(
      currentUser,
      createArticleDto,
    );
    return this.articlesService.buildArticleResponse(article);
  }

  @Get(':slug')
  async getSingleArticle(
    @Param('slug') slug: string,
  ): Promise<ArticlesResponse> {
    const article = await this.articlesService.findOneBySlug(slug);

    return this.articlesService.buildArticleResponse(article);
  }
}
