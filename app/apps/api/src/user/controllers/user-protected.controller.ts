import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from '../user.service';
import { InitAdministratorDto } from '../dtos';
import { Auth } from '../../auth/decorators/auth.decorator';
import { UserId } from '../../auth/decorators/user-id.decorator';
import { ApiTags } from '@nestjs/swagger';
import { GetDataWithFilterDto } from '@app/shared/dtos';
import { UserEntity } from '@app/dal/repositories';

@ApiTags('user')
@Controller({
  version: 'protected',
  path: 'user',
})
@Auth()
export class UserControllerProtected {
  constructor(private readonly userService: UserService) {}

  @Get('info')
  async userInfo(@UserId() userId: number) {
    return this.userService.getById(userId);
  }

  @Get()
  get(@Query() data: GetDataWithFilterDto<UserEntity>) {
    return this.userService.get(data);
  }
}
