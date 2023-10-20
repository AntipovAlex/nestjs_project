import { SECRET_KEY } from '@app/types';
import { RequestInterfaceExpress } from '@app/types/RequestInterfaceExpress';
import { UsersEntity } from '@app/users/users.entity';
import { UsersService } from '@app/users/users.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthMuddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService) {}

  async use(req: RequestInterfaceExpress, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
    }

    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoderUser = verify(token, SECRET_KEY) as UsersEntity;

      const user = await this.userService.findById(decoderUser.id);
      req.user = user;
      next();
    } catch (e) {
      req.user = null;
      next();
    }
  }
}
