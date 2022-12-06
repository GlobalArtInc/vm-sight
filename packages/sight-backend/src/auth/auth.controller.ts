import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto } from './common/auth.dto';
import { Response } from 'express';
import { AttachUser, Cookies, GetUser } from 'src/common/decorators/auth.decorators';
import { User } from 'src/user/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @AttachUser()
  @ApiOperation({
    summary: 'Get current user',
  })
  @Get('me')
  getUser(@GetUser() user: User) {
    return user;
  }

  @ApiOperation({
    summary: 'Logout user',
  })
  @Post('logout')
  logoutUser(@Cookies('uid') uid: string, @Res({ passthrough: true }) res: Response) {
    return this.service.logout(uid, res);
  }

  @ApiOperation({
    summary: 'Authenticate user',
  })
  @Post('login')
  loginUser(@Body() dto: LoginUserDto, @Res({ passthrough: true }) res: Response) {
    return this.service.authServiceByCreds(dto, res);
  }
}
