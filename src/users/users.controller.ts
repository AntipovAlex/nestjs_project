import { Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('users')
  async createUsers(): Promise<any> {
    return await this.usersService.createUsers();
  }
}
