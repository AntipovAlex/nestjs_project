import { ArticlesEntity } from './articles.entity';

export interface ArticleResponse {
  article: ArticlesEntity;
}

export type ArticlesResponse = {
  articles: ArticlesEntity[];
  articlesCounter: number;
};

export interface ArticlesQueryParams {
  tag?: string;
  author?: string;
  favorited?: string;
  limit?: string;
  offset?: string;
}
