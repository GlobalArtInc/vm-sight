import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InitAdminDto } from './common/user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserPublicController {
  constructor(private readonly service: UserService) {}

  @ApiTags('users')
  @Get('/admin/check')
  checkAdmin() {
    return this.service.checkAdmin();
  }

  @ApiTags('users')
  @Post('admin/init')
  initAdmin(@Body() dto: InitAdminDto) {
    return this.service.initAdmin(dto);
  }
}
