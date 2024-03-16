import { Injectable } from '@nestjs/common';
import { HttpAuthStrategy } from './auth.strategy';
import { Request, Response } from 'express';
import { AuthHttpEnum } from '../../enums';
import { AuthRequest } from '../../types/reqeust-auth-info.type';

@Injectable()
export class AuthCookieStrategy extends HttpAuthStrategy {
  async canActivate(request: AuthRequest, response: Response): Promise<boolean> {
    const sessionId = request.cookies[AuthHttpEnum.VMSDCS];

    try {
      if (sessionId) {
        const authorizationInfo = await this.authService.info(sessionId);
        request.authorizationInfo = authorizationInfo;
      } else {
        return false;
      }

      return true;
    } catch (err) {
      return false;
    }
  }
}
