import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'follows' })
export class FollowsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  followedId: number;

  @Column()
  followingId: number;
}
