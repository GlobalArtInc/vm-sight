import { Inject } from '@nestjs/common';
import { AuthService } from '../../auth.service';
import { AuthRequest } from '../../types/reqeust-auth-info.type';
import { type Response } from 'express';

export abstract class HttpAuthStrategy {
  constructor(@Inject(AuthService) protected readonly authService: AuthService) {}
  abstract canActivate(request: AuthRequest, response: Response): Promise<boolean> | boolean;
}
