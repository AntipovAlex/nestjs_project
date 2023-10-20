import { RequestInterfaceExpress } from '@app/types/RequestInterfaceExpress';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<RequestInterfaceExpress>();

    if (request.user) {
      return true;
    }

    throw new HttpException('User not authorized', HttpStatus.UNAUTHORIZED);
  }
}
