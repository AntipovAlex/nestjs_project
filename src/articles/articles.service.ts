import { Injectable } from '@nestjs/common';

@Injectable()
export class ArticlesService {
  async createArticle() {
    return 'create article in service';
  }
}
