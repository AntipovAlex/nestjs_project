import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ArticlesEntity } from './articles.entity';

@Entity({ name: 'comments' })
export class CommentsEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  body: string;

  @ManyToOne(() => ArticlesEntity, (article) => article.comments)
  article: ArticlesEntity;
}
