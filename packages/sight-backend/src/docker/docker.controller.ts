import { Controller, Get, Patch, Param, Res, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AttachUser } from 'src/common/decorators/auth.decorators';
import { InstancesService } from '../instances/instances.service';
import { DockerService } from './docker.service';
import { Response } from 'express';
import { executeContainerActionDto } from './common/docker.dto';

@AttachUser()
@ApiTags('endpoints_docker')
@Controller('endpoints/:endpointId/docker')
export class DockerController {
  constructor(private readonly service: DockerService, private instancesService: InstancesService) {}

  @Get('info')
  getInfo(@Param('endpointId') endpointId: number) {
    return this.service.getInfo(endpointId);
  }

  @Get('version')
  getVersion(@Param('endpointId') endpointId: number) {
    return this.service.getVersion(endpointId);
  }

  // Work with containers
  @Get('containers')
  getContainers(@Param('endpointId') endpointId: number) {
    return this.service.getContainers(endpointId);
  }

  @Get('containers/:containerId')
  getContainerById(@Param('endpointId') endpointId: number, @Param('containerId') containerId: string) {
    return this.service.getContainerStats(endpointId, containerId);
  }

  @Patch('containers/:containerId')
  executeContainerAction(
    @Body() dto: executeContainerActionDto,
    @Param('endpointId') endpointId: number,
    @Param('containerId') containerId: string,
  ) {
    return this.service.executeContainerAction(endpointId, containerId, dto);
  }

  @Get('containers/:containerId/logs')
  getContainerLogs(
    @Param('endpointId') endpointId: number,
    @Param('containerId') containerId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.set('Content-Type', 'text/plain');

    return this.service.getContainerLogs(endpointId, containerId);
  }

  // Work with networks
  @Get('networks')
  getNetworks(@Param('endpointId') endpointId: number) {
    return this.service.getNetworks(endpointId);
  }

  @Get('networks/:networkId')
  inspectNetwork(@Param('endpointId') endpointId: number, @Param('networkId') networkId: string) {
    return this.service.inspectNetwork(endpointId, networkId);
  }

  // Work with volumes
  @Get('volumes')
  getVolumes(@Param('endpointId') endpointId: number) {
    return this.service.getVolumes(endpointId);
  }

  @Get('volumes/:volumeId')
  inspectVolume(@Param('endpointId') endpointId: number, @Param('volumeId') volumeId: string) {
    return this.service.inspectVolume(endpointId, volumeId);
  }

  //
}
