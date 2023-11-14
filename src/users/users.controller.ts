import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '@app/dto/createUser.dto';
import { UserResponse } from './users.types';
import { LoginUserDto } from '@app/dto/loginUser.dto';
import { UserDecoratar } from '@app/decorators/user.decorators';
import { UsersEntity } from './users.entity';
import { AuthGuard } from '@app/guards/auth.guard';
import { UpdateUserDto } from '@app/dto/updateUser.dto';
import { BackendValidationPipe } from '@app/shared/pipes/backendValidation.pipe';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('users')
  @UsePipes(new BackendValidationPipe())
  async createUsers(
    @Body('user') createUsersDto: CreateUserDto,
  ): Promise<UserResponse> {
    const user = await this.usersService.createUsers(createUsersDto);
    return this.usersService.buildUserResponse(user);
  }

  @Post('users/login')
  @UsePipes(new BackendValidationPipe())
  async login(@Body('user') loginUserDto: LoginUserDto): Promise<UserResponse> {
    const user = await this.usersService.loginUser(loginUserDto);
    return this.usersService.buildUserResponse(user);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async currentUser(@UserDecoratar() user: UsersEntity): Promise<UserResponse> {
    return this.usersService.buildUserResponse(user);
  }

  @Put('user')
  @UseGuards(AuthGuard)
  async updateCurrentUser(
    @UserDecoratar('id') currentUserId: number,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    const user = await this.usersService.updateUser(
      currentUserId,
      updateUserDto,
    );
    return this.usersService.buildUserResponse(user);
  }
}
