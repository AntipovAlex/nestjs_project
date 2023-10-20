import { CreateUserDto } from '@app/dto/createUser.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersEntity } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '../types';
import { UserResponse, UserWitoutPasssword } from './users.types';
import { LoginUserDto } from '@app/dto/loginUser.dto';
import { compare } from 'bcrypt';
import { UpdateUserDto } from '@app/dto/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async createUsers(createUsersDto: CreateUserDto): Promise<UsersEntity> {
    const isUserByName: boolean = Boolean(
      await this.usersRepository.findOne({
        where: { name: createUsersDto.name },
      }),
    );

    const isUserByEmail: boolean = Boolean(
      await this.usersRepository.findOneBy({
        email: createUsersDto.email,
      }),
    );

    if (isUserByEmail || isUserByName) {
      throw new HttpException(
        'User with email or name already exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

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

  async loginUser(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { email: loginUserDto.email },
      select: ['id', 'name', 'email', 'bio', 'image', 'password'],
    });

    if (!user) {
      throw new HttpException(
        'Credetials are not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isPasswordCorrect = await compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new HttpException(
        'Credetials are not valid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    delete user.password;

    return user;
  }

  findById(id: number): Promise<UsersEntity> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UsersEntity> {
    const user = await this.findById(id);
    Object.assign(user, updateUserDto);

    return await this.usersRepository.save(user);
  }
}
