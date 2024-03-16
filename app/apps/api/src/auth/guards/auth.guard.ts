import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthCookieStrategy } from './strategies/auth-cookie.strategy';
import type { Request, Response } from 'express';
import { AuthTokenStrategy } from './strategies/auth-token.strategy';
import { AuthRequest } from '../types/reqeust-auth-info.type';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(AuthCookieStrategy)
    private readonly authCookieStrategy: AuthCookieStrategy,
    @Inject(AuthTokenStrategy)
    private readonly authTokenStrategy: AuthTokenStrategy
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const response = context.switchToHttp().getResponse<Response>();
    const authStrategy = this.getAuthStrategy(request);

    return authStrategy.canActivate(request, response);
  }

  private getAuthStrategy(request: Request) {
    const hasTokenInHeader = request.headers['authorization'] as string;

    if (hasTokenInHeader) {
      return this.authTokenStrategy;
    } else {
      return this.authCookieStrategy;
    }
  }
}
