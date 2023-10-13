import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '@app/dto/createUser.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('users')
  async createUsers(@Body('user') createUsersDto: CreateUserDto): Promise<any> {
    return await this.usersService.createUsers(createUsersDto);
  }
}
