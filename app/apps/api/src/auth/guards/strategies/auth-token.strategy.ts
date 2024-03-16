import { Injectable } from '@nestjs/common';
import { HttpAuthStrategy } from './auth.strategy';
import { AuthRequest } from '../../types/reqeust-auth-info.type';

@Injectable()
export class AuthTokenStrategy extends HttpAuthStrategy {
  async canActivate(request: AuthRequest): Promise<boolean> {
    const sessionId = request.headers['authorization'];

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
