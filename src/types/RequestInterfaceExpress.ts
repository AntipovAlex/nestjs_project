import { UsersEntity } from '@app/users/users.entity';
import { Request } from 'express';

export interface RequestInterfaceExpress extends Request {
  user?: UsersEntity;
}
