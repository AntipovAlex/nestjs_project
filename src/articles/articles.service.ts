import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ArticlesEntity } from './articles.entity';
import { UsersEntity } from '@app/users/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import slugify from 'slugify';
import {
  ArticleResponse,
  ArticlesQueryFeedParams,
  ArticlesQueryParams,
  ArticlesResponse,
} from './articles.types';
import { FollowsEntity } from '@app/profile/follow.entity';
import { CreateArticleDto } from '@app/dto/createArticle.dto';
import { UpdateArticleDto } from '@app/dto/updateArticle.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticlesEntity)
    private readonly articleRepository: Repository<ArticlesEntity>,
    public readonly dataSource: DataSource,
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    @InjectRepository(FollowsEntity)
    private readonly followRepository: Repository<FollowsEntity>,
  ) {}
  async createArticle(
    currentUser: UsersEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticlesEntity> {
    const newArticle = new ArticlesEntity();
    Object.assign(newArticle, createArticleDto);

    if (!newArticle.tagList) {
      newArticle.tagList = [];
    }

    newArticle.author = currentUser;
    newArticle.slug = this.getSlug(createArticleDto.title);

    return await this.articleRepository.save(newArticle);
  }

  private getSlug(title: string) {
    return (
      slugify(title, { lower: true }) +
      '-' +
      (Math.random() + 1).toString(36).substring(7)
    );
  }

  buildArticleResponse(article: ArticlesEntity): ArticleResponse {
    return { article };
  }

  async findOneBySlug(slug: string): Promise<ArticlesEntity> {
    return await this.articleRepository.findOne({ where: { slug } });
  }

  async deleteSingleArticle(
    currentUserId: number,
    slug: string,
  ): Promise<DeleteResult> {
    const article = await this.findOneBySlug(slug);

    if (!article) {
      throw new HttpException('Article is not exist', HttpStatus.BAD_REQUEST);
    }

    if (article.author.id !== currentUserId) {
      throw new HttpException(
        'You are not author this article',
        HttpStatus.FORBIDDEN,
      );
    }

    return await this.articleRepository.delete({ slug });
  }

  async updateSingleArticle(
    currentUserId: number,
    slug: string,
    updateArticleDto: UpdateArticleDto,
  ) {
    const article = await this.findOneBySlug(slug);

    if (!article) {
      throw new HttpException('Article is not exist', HttpStatus.BAD_REQUEST);
    }

    if (article.author.id !== currentUserId) {
      throw new HttpException(
        'You are not author this article',
        HttpStatus.FORBIDDEN,
      );
    }

    Object.assign(article, updateArticleDto);

    return this.articleRepository.save(article);
  }

  async findArticles(
    currentUserId: number,
    query: ArticlesQueryParams,
  ): Promise<ArticlesResponse> {
    const queryBuilder = this.dataSource
      .getRepository(ArticlesEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');

    queryBuilder.orderBy('articles.createdAt', 'DESC');
    const articlesCount = await queryBuilder.getCount();

    if (query.limit) {
      queryBuilder.limit(Number(query.limit));
    }

    if (query.offset) {
      queryBuilder.offset(Number(query.offset));
    }

    if (query.author) {
      const author = await this.usersRepository.findOne({
        where: { name: query.author },
      });
      queryBuilder.andWhere('articles.authorId = :id', {
        id: (await author).id,
      });
    }

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`,
      });
    }

    if (query.favorited) {
      const author = await this.usersRepository.findOne({
        where: { name: query.favorited },
        relations: ['favorites'],
      });
      const ids = author.favorites.map((article) => article.id);
      if (ids.length > 0) {
        queryBuilder.andWhere('articles.authorId IN (:...ids)', { ids });
      } else {
        queryBuilder.andWhere('1=0');
      }
    }
    let favoritedIds: Array<number> = [];

    if (currentUserId) {
      const currentUser = this.usersRepository.findOne({
        where: { id: currentUserId },
        relations: ['favorites'],
      });
      favoritedIds = (await currentUser).favorites.map(
        (favorite) => favorite.id,
      );
    }
    const articles = await queryBuilder.getMany();

    const articlesWithFavorited = articles.map((article) => {
      const favorited = favoritedIds.includes(article.id);
      return { ...article, favorited };
    });

    return { articles: articlesWithFavorited, articlesCount };
  }

  async feedArticles(
    currentUserId: number,
    query: ArticlesQueryFeedParams,
  ): Promise<ArticlesResponse> {
    const follows = await this.followRepository.find({
      where: {
        followedId: currentUserId,
      },
    });

    if (follows.length === 0) {
      return { articles: [], articlesCount: 0 };
    }

    const followingUserId = follows.map((follow) => follow.followingId);
    const queryBuilder = this.dataSource
      .getRepository(ArticlesEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')
      .where('articles.authorId IN (:...ids)', { ids: followingUserId });

    queryBuilder.orderBy('articles.createdAt', 'DESC');
    const articlesCount = await queryBuilder.getCount();

    if (query.limit) {
      queryBuilder.limit(Number(query.limit));
    }

    if (query.offset) {
      queryBuilder.offset(Number(query.offset));
    }

    const articles = await queryBuilder.getMany();

    return { articles, articlesCount };
  }

  async addArticleToFavorites(
    currentUserId: number,
    slug: string,
  ): Promise<ArticlesEntity> {
    const article = await this.findOneBySlug(slug);
    const user = await this.usersRepository.findOne({
      where: { id: currentUserId },
      relations: ['favorites'],
    });

    const isNotFavorited =
      user.favorites.findIndex(
        (articleInFavorites) => articleInFavorites.id === article.id,
      ) === -1;

    if (isNotFavorited) {
      user.favorites.push(article);
      article.favoritesCount++;
      await this.usersRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }

  async deleteArticleFromFavorites(
    currentUserId: number,
    slug: string,
  ): Promise<ArticlesEntity> {
    const article = await this.findOneBySlug(slug);
    const user = await this.usersRepository.findOne({
      where: { id: currentUserId },
      relations: ['favorites'],
    });

    const articleIndex = user.favorites.findIndex(
      (articleInFavorites) => articleInFavorites.id === article.id,
    );

    if (articleIndex >= 0) {
      user.favorites.splice(articleIndex, 1);
      console.log('user.favorites', user.favorites);

      article.favoritesCount--;
      await this.usersRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }
}
