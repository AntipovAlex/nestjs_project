import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UserDecoratar } from '@app/decorators/user.decorators';
import { ProfileResponse } from './profile.types';
import { AuthGuard } from '@app/guards/auth.guard';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Get(':username')
  async getProfile(
    @Param('username') username: string,
    @UserDecoratar('id') currentUserId: number,
  ): Promise<ProfileResponse> {
    const profile = await this.profileService.getProfile(
      username,
      currentUserId,
    );
    return this.profileService.buildProfileResponse(profile);
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followProfile(
    @Param('username') userName: string,
    @UserDecoratar('id') currentUserId: number,
  ): Promise<ProfileResponse> {
    const profile = await this.profileService.followProfile(
      userName,
      currentUserId,
    );

    return this.profileService.buildProfileResponse(profile);
  }

  @Delete(':username/follow')
  @UseGuards(AuthGuard)
  async unFollowProfile(
    @Param('username') userName: string,
    @UserDecoratar('id') currentUserId: number,
  ): Promise<ProfileResponse> {
    const profile = await this.profileService.unFollowProfile(
      userName,
      currentUserId,
    );

    return this.profileService.buildProfileResponse(profile);
  }
}
