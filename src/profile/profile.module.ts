import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UsersEntity } from '@app/users/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowsEntity } from './follow.entity';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [TypeOrmModule.forFeature([UsersEntity, FollowsEntity])],
})
export class ProfileModule {}
