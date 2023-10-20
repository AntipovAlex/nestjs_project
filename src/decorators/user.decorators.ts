import { RequestInterfaceExpress } from '@app/types/RequestInterfaceExpress';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const UserDecoratar = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const request = context
      .switchToHttp()
      .getRequest<RequestInterfaceExpress>();

    if (!request.user) {
      return null;
    }

    if (data) {
      return request.user[data];
    }

    return request.user;
  },
);
