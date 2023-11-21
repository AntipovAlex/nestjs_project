import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { AuthGuard } from '@app/guards/auth.guard';
import { UserDecoratar } from '@app/decorators/user.decorators';
import { UsersEntity } from '@app/users/users.entity';
import { CommentsEntity } from './comments.entity';
import {
  ArticleResponse,
  ArticlesQueryFeedParams,
  ArticlesQueryParams,
  ArticlesResponse,
  CommentsResponse,
} from './articles.types';
import { BackendValidationPipe } from '@app/shared/pipes/backendValidation.pipe';
import { CreateArticleDto } from '@app/dto/createArticle.dto';
import { UpdateArticleDto } from '@app/dto/updateArticle.dto';
import { CreateCommentDto } from '@app/dto/createComment.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  async getAllArticles(
    @UserDecoratar('id') currentUserId: number,
    @Query() query: ArticlesQueryParams,
  ): Promise<ArticlesResponse> {
    return await this.articlesService.findArticles(currentUserId, query);
  }

  @Get('feed')
  @UseGuards(AuthGuard)
  async getFeed(
    @UserDecoratar('id') currentUserId: number,
    @Query() query: ArticlesQueryFeedParams,
  ): Promise<ArticlesResponse> {
    return await this.articlesService.feedArticles(currentUserId, query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async createArticle(
    @UserDecoratar() currentUser: UsersEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<ArticleResponse> {
    const article = await this.articlesService.createArticle(
      currentUser,
      createArticleDto,
    );
    return this.articlesService.buildArticleResponse(article);
  }

  @Post(':slug/comments')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async createComment(
    @Param('slug') slug: string,
    @Body('comment') createCommentDto: CreateCommentDto,
  ): Promise<ArticleResponse> {
    return await this.articlesService.createComment(slug, createCommentDto);
  }

  @Get(':slug/comments')
  async getComments(@Param('slug') slug: string): Promise<CommentsResponse> {
    const article = await this.articlesService.findOneBySlug(slug);
    return { comments: article.comments };
  }

  @Get(':slug/comments/:id')
  async getComment(
    @Param('slug') slug: string,
    @Param('id') currentComment: number,
  ): Promise<CommentsEntity> {
    return this.articlesService.findCommentById(slug, currentComment);
  }

  @Delete(':slug/comments/:id')
  async deleteComment(
    @Param('slug') slug: string,
    @Param('id') currentComment: string,
    @UserDecoratar('id') currentUserId: number,
  ): Promise<ArticleResponse> {
    const article = await this.articlesService.deleteCommentById(
      slug,
      currentComment,
      currentUserId,
    );
    return this.articlesService.buildArticleResponse(article);
  }

  @Get(':slug')
  async getSingleArticle(
    @Param('slug') slug: string,
  ): Promise<ArticleResponse> {
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
  @UsePipes(new BackendValidationPipe())
  async updateSingleArticle(
    @Body('article') updateArticleDto: UpdateArticleDto,
    @UserDecoratar('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponse> {
    const article = await this.articlesService.updateSingleArticle(
      currentUserId,
      slug,
      updateArticleDto,
    );

    return this.articlesService.buildArticleResponse(article);
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async addArticleToFavorites(
    @UserDecoratar('id') currentUsrId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponse> {
    const article = await this.articlesService.addArticleToFavorites(
      currentUsrId,
      slug,
    );
    return this.articlesService.buildArticleResponse(article);
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  async deleteArticleFromFavorites(
    @UserDecoratar('id') currentUsrId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponse> {
    const article = await this.articlesService.deleteArticleFromFavorites(
      currentUsrId,
      slug,
    );
    return this.articlesService.buildArticleResponse(article);
  }
}
