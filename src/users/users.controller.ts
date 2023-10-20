import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '@app/dto/createUser.dto';
import { UserResponse } from './users.types';
import { LoginUserDto } from '@app/dto/loginUser.dto';
import { UserDecoratar } from '@app/decorators/user.decorators';
import { UsersEntity } from './users.entity';

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

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async login(@Body('user') loginUserDto: LoginUserDto): Promise<UserResponse> {
    const user = await this.usersService.loginUser(loginUserDto);
    return this.usersService.buildUserResponse(user);
  }

  @Get('user')
  async currentUser(@UserDecoratar() user: UsersEntity): Promise<UserResponse> {
    return this.usersService.buildUserResponse(user);
  }
}
