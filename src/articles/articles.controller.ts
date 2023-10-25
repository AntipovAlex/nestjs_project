import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { AuthGuard } from '@app/guards/auth.guard';
import { UserDecoratar } from '@app/decorators/user.decorators';
import { UsersEntity } from '@app/users/users.entity';
import { ArticlesEntity } from './articles.entity';
import { ArticlesResponse } from './articles.types';
import { UpdateArticle } from '@app/dto/updateArticle.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}
  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
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

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteSingleArticle(
    @UserDecoratar('id') currentUserId: number,
    @Param('slug') slug: string,
  ) {
    return await this.articlesService.deleteSingleArticle(currentUserId, slug);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateSingleArticle(
    @Body('article') updateArticleDto: UpdateArticle,
    @UserDecoratar('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<ArticlesResponse> {
    const article = await this.articlesService.updateSingleArticle(
      currentUserId,
      slug,
      updateArticleDto,
    );

    return this.articlesService.buildArticleResponse(article);
  }
}
