import { Injectable } from '@nestjs/common';
import { ArticlesEntity } from './articles.entity';
import { UsersEntity } from '@app/users/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { ArticlesResponse } from './articles.types';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticlesEntity)
    private readonly articleRepository: Repository<ArticlesEntity>,
  ) {}
  async createArticle(
    currentUser: UsersEntity,
    createArticleDto: ArticlesEntity,
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

  buildArticleResponse(article: ArticlesEntity): ArticlesResponse {
    return { article };
  }

  async findOneBySlug(slug: string): Promise<ArticlesEntity> {
    return await this.articleRepository.findOne({ where: { slug } });
  }
}
