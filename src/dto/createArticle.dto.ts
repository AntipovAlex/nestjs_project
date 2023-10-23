import { IsNotEmpty } from 'class-validator';

export class CreateArticle {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  readonly body: string;

  readonly list?: Array<string>;
}
