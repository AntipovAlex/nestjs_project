import { Controller, Get, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UserDecoratar } from '@app/decorators/user.decorators';
import { ProfileResponse } from './profile.types';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Get(':username')
  async getProfile(
    @Param('username') userName: string,
    @UserDecoratar('id') currentUserId: number,
  ): Promise<ProfileResponse> {
    console.log(currentUserId);

    const profile = await this.profileService.getProfile(
      userName,
      currentUserId,
    );
    return this.profileService.buildProfileResponse(profile);
  }
}
