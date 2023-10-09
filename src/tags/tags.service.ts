import { Injectable } from '@nestjs/common';

@Injectable()
export class TagsService {
  getAll(): Array<string> {
    return ['coffee', 'dragons', 'tea', 'beers'];
  }
}
