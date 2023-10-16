import { CreateUserDto } from '@app/dto/createUser.dto';
import { Injectable } from '@nestjs/common';
import { UsersEntity } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '../types';
import { UserResponse, UserWitoutPasssword } from './users.types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}
  async createUsers(createUsersDto: CreateUserDto) {
    const newUsers = new UsersEntity();
    Object.assign(newUsers, createUsersDto);

    return await this.usersRepository.save(newUsers);
  }

  generateJwtToken(user: UserWitoutPasssword): string {
    return sign(
      { id: user.id, name: user.name, email: user.email },
      SECRET_KEY,
    );
  }

  buildUserResponse(user: UserWitoutPasssword): UserResponse {
    return {
      user: {
        ...user,
        token: this.generateJwtToken(user),
      },
    };
  }
}
