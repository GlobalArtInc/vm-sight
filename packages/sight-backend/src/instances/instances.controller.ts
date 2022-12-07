import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AttachUser, GetUser } from 'src/common/decorators/auth.decorators';
import { User } from 'src/user/user.entity';
import { CreateDockerEndpointDto } from './common/instances.dto';
import { InstancesService } from './instances.service';

@AttachUser()
@ApiTags('endpoints')
@Controller('endpoints')
export class InstancesController {
  constructor(private service: InstancesService) {}

  @ApiOperation({
    summary: 'Get all instances',
  })
  @Get()
  getEndpoints(@GetUser() user: User) {
    return this.service.getEndpoints(user.id);
  }

  @ApiOperation({
    summary: 'Create a new endpoint',
  })
  @Post()
  createEndpoint(@GetUser() callerUser: User, @Body() dto: CreateDockerEndpointDto) {
    return this.service.createEndpoint(callerUser, dto);
  }

  @Get(':endpointId')
  getEndpoint(@Param('endpointId') endpointId: string) {
    return this.service.getEndpointById(endpointId);
  }
}
