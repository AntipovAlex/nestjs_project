import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  async createUsers() {
    return await 'Create Users';
  }
}
