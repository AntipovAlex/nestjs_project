import { UsersEntity } from './users.entity';

export interface UserResponse {
  user: UserWitoutPasssword & { token: string };
}

export type UserWitoutPasssword = Omit<UsersEntity, 'hasPassword'>;
