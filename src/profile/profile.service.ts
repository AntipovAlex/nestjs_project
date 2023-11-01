import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProfileResponse, ProfileType } from './profile.types';
import { Repository } from 'typeorm';
import { UsersEntity } from '@app/users/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserWitoutPasssword } from '@app/users/users.types';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}
  buildProfileResponse(profile: ProfileType): ProfileResponse {
    delete profile.email;
    return { profile };
  }

  async getProfile(
    userName: string,
    currentUserId: number,
  ): Promise<ProfileType> {
    const user = (await this.usersRepository.findOne({
      where: { name: userName },
    })) as UserWitoutPasssword;

    if (!user) {
      throw new HttpException('Profile does not exit', HttpStatus.NOT_FOUND);
    }

    return { ...user, following: false };
  }
}
