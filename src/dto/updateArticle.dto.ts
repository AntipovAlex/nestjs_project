import { IsNotEmpty } from 'class-validator';

export class UpdateArticle {
  @IsNotEmpty()
  readonly title: string;

  readonly description: string;

  readonly body: string;
}
