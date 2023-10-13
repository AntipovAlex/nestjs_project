import { CreateUserDto } from '@app/dto/createUser.dto';
import { Injectable } from '@nestjs/common';
import { UsersEntity } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
}
