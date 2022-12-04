import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AttachUser, GetUser } from 'src/common/decorators/auth.decorators';
import { User } from 'src/user/user.entity';
import { InstancesService } from '../instances/instances.service';
import { DockerService } from './docker.service';

@AttachUser()
@ApiTags('endpoints_docker')
@Controller('endpoints/:endpointId/docker')
export class DockerController {
  constructor(private readonly service: DockerService, private instancesService: InstancesService) {}

  @Get('info')
  getInfo(@Param('endpointId') endpointId: number) {
    return this.service.getInfo(endpointId);
  }
}
