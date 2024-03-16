import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from '../user.service';
import { InitAdministratorDto } from '../dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller({
  version: 'public',
  path: 'user',
})
export class UserControllerPublic {
  constructor(private readonly userService: UserService) {}

  @Get('admin/check')
  async isAdministratorPresent() {
    const isAdministratorPresent = await this.userService.isAdministratorPresent();

    return { isAdministratorPresent };
  }

  @Post('admin/init')
  async initAdministrator(@Body() data: InitAdministratorDto) {
    await this.userService.initAdministrator(data);
  }
}
