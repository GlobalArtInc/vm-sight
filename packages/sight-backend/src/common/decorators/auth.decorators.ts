import { createParamDecorator, ExecutionContext, UseGuards } from '@nestjs/common';
import { GetUserGuard } from '../guards/user.guard';

export const GetUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const { user } = request;
  const { id, email, role, createdAt, updatedAt } = user;
  const formattedUser = { id, email, role, createdAt, updatedAt };

  return formattedUser;
});

export const AttachUser = () => UseGuards(GetUserGuard);
