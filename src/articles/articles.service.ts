import { Injectable } from '@nestjs/common';
import { ArticlesEntity } from './articles.entity';
import { UsersEntity } from '@app/users/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
    newArticle.slug = '';

    return await this.articleRepository.save(newArticle);
  }
}
