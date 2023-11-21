import { ArticlesEntity } from './articles.entity';
import { CommentsEntity } from './comments.entity';

export interface ArticleResponse {
  article: ArticlesEntity;
}

export type ArticlesResponse = {
  articles: ArticlesWithoutupdateTimestamp[];
  articlesCount: number;
};

export interface ArticlesQueryParams {
  tag?: string;
  author?: string;
  favorited?: string;
  limit?: string;
  offset?: string;
}

export type ArticlesWithoutupdateTimestamp = Omit<
  ArticlesEntity,
  'updateTimestamp'
>;

export type ArticlesQueryFeedParams = {
  limit?: string;
  offset?: string;
};

export type CommentsResponse = {
  comments: CommentsEntity[];
};
