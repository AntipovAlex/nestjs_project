import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProfileResponse, ProfileType } from './profile.types';
import { Repository } from 'typeorm';
import { UsersEntity } from '@app/users/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserWitoutPasssword } from '@app/users/users.types';
import { FollowsEntity } from './follow.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    @InjectRepository(FollowsEntity)
    private readonly followsRepository: Repository<FollowsEntity>,
  ) {}
  buildProfileResponse(profile: ProfileType): ProfileResponse {
    delete profile.email;
    return { profile };
  }

  async getProfile(
    username: string,
    currentUserId: number,
  ): Promise<ProfileType> {
    const user: UserWitoutPasssword = await this.usersRepository.findOne({
      where: { name: username },
    });

    if (!user) {
      throw new HttpException('Profile does not exit', HttpStatus.NOT_FOUND);
    }

    const follow = await this.followsRepository.findOne({
      where: { followedId: currentUserId, followingId: user.id },
    });

    return { ...user, following: Boolean(follow) };
  }

  async followProfile(
    username: string,
    currentUserId: number,
  ): Promise<ProfileType> {
    const user: UserWitoutPasssword = await this.usersRepository.findOne({
      where: { name: username },
    });

    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }

    if (currentUserId === user.id) {
      throw new HttpException(
        'Followed user should not be equel following user',
        HttpStatus.BAD_REQUEST,
      );
    }

    const follow = await this.followsRepository.findOne({
      where: { followedId: currentUserId, followingId: user.id },
    });

    if (!follow) {
      const followCreate = new FollowsEntity();
      followCreate.followedId = currentUserId;
      followCreate.followingId = user.id;

      await this.followsRepository.save(followCreate);
    }

    return { ...user, following: true };
  }

  async unFollowProfile(
    username: string,
    currentUserId: number,
  ): Promise<ProfileType> {
    const user: UserWitoutPasssword = await this.usersRepository.findOne({
      where: { name: username },
    });

    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }

    if (currentUserId === user.id) {
      throw new HttpException(
        'Followed user should not be equel following user',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.followsRepository.delete({
      followedId: currentUserId,
      followingId: user.id,
    });

    return { ...user, following: false };
  }
}
