import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AttachUser, GetUser } from './common/decorators/auth.decorators';
import { User } from './user/user.entity';

@AttachUser()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(@GetUser() user: User) {
    return user;
  }
}
