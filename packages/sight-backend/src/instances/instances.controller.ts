import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AttachUser, GetUser } from 'src/common/decorators/auth.decorators';
import { User } from 'src/user/user.entity';
import { InstancesService } from './instances.service';

@AttachUser()
@ApiTags('endpoints')
@Controller('endpoints')
export class InstancesController {
  constructor(private service: InstancesService) {}

  @Get()
  getEndpoints(@GetUser() user: User) {
    return this.service.getEndpoints(user.id);
  }
}
