import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '@app/dto/createUser.dto';
import { UserResponse } from './users.types';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('users')
  @UsePipes(new ValidationPipe())
  async createUsers(
    @Body('user') createUsersDto: CreateUserDto,
  ): Promise<UserResponse> {
    const user = await this.usersService.createUsers(createUsersDto);
    return this.usersService.buildUserResponse(user);
  }
}
