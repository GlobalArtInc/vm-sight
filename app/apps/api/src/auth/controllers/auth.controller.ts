import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AuthUserDto } from '../dtos';
import { Response } from 'express';
import { AuthCookieEnum } from '@app/shared/enums';
import { Cookies } from '../decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller({
  version: 'public',
  path: 'auth',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: AuthUserDto, @Res({ passthrough: true }) response: Response) {
    const session = await this.authService.login(dto);

    response.cookie(AuthCookieEnum.SESSION, session.uid);
  }

  @Get('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(AuthCookieEnum.SESSION);
  }
}
