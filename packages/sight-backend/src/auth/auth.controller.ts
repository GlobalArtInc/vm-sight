import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto } from './common/auth.dto';
import { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  loginUser(@Body() dto: LoginUserDto, @Res({ passthrough: true }) res: Response) {
    return this.service.authServiceByCreds(dto, res);
  }
}
