import { type ExecutionContext, createParamDecorator } from '@nestjs/common';
import { AuthRequest } from '../types/reqeust-auth-info.type';

export const UserId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<AuthRequest>();

  return request.authorizationInfo.userId;
});
