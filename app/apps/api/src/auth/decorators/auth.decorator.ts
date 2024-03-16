import { ExecutionContext, UseGuards, createParamDecorator } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
export const Auth = () => UseGuards(AuthGuard);

export const Cookies = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  return data ? request.cookies?.[data] : request.cookies;
});
