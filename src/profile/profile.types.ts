import { UserWitoutPasssword } from '@app/users/users.types';

export type ProfileType = UserWitoutPasssword & { following: boolean };

export interface ProfileResponse {
  profile: ProfileType;
}
