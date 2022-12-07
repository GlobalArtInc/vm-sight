import { Injectable, Inject, forwardRef, NotFoundException } from '@nestjs/common';
import { Instances } from 'src/instances/instances.entity';
import * as Docker from 'dockerode';
import { InstancesService } from 'src/instances/instances.service';
import { DockerContainerActions } from './common/docker.enum';
import { executeContainerActionDto } from './common/docker.dto';
import { EndpointType } from 'src/instances/common/instances.enums';
import { throws } from 'assert';

@Injectable()
export class DockerService {
  constructor(@Inject(forwardRef(() => InstancesService)) private readonly instancesService: InstancesService) {}

  protected socket: Docker;
  protected endpoint: Instances;

  async checkConnection(type: EndpointType, config: string) {
    if (type === EndpointType.DockerSocket) {
      this.socket = new Docker({
        socketPath: '/var/run/docker.sock',
      });

      return this.socket.version();
    } else {
      const { host, port } = JSON.parse(config);
      this.socket = new Docker({
        host: host as string,
        port: port as number,
      });

      return this.socket.version();
    }
  }

  async getClusterInfo() {
    const [info, { Volumes }, images, containers] = await Promise.all([
      this.socket.info(),
      this.socket.listVolumes(),
      this.socket.listImages(),
      this.socket.listContainers(),
    ]);

    return { info, volumes: Volumes, images, containers };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructSnapshot(data: any) {
    const HealthyContainerCount = data?.containers.filter((item: Docker.ContainerInfo) => item.Status === 'healthy');
    const UnhealthyContainerCount = data?.containers.filter(
      (item: Docker.ContainerInfo) => item.Status === 'unhealthy',
    );

    return {
      DockerVersion: data?.info.ServerVersion,
      Containers: data?.info.Containers,
      RunningContainerCount: data?.info.ContainersRunning,
      StoppedContainerCount: data?.info.ContainersStopped,
      HealthyContainerCount: HealthyContainerCount.length,
      UnhealthyContainerCount: UnhealthyContainerCount.length,
      ImageCount: data?.images.length,
      ServiceCount: 0,
      StackCount: 0,
      Swarm: 'active',
      Time: Math.floor(new Date(data.info.SystemTime).getTime() / 1000),
      TotalCPU: data?.info.NCPU,
      TotalMemory: data?.info.MemTotal,
      VolumeCount: data?.volumes.length,
    };
  }

  async getEndpointById(endpointId: string) {
    const [endpoint, config] = await Promise.all([
      this.instancesService.getById(endpointId),
      this.instancesService.getConfigById(endpointId),
    ]);
    if (!endpoint || !config) {
      throw new NotFoundException('endpoint_not_found');
    }
    await this.checkConnection(endpoint.type, config);

    return endpoint;
  }

  async getInfo(endpointId: string) {
    await this.getEndpointById(endpointId);

    return this.socket.info();
  }

  async getVersion(endpointId: string) {
    await this.getEndpointById(endpointId);

    return this.socket.version();
  }

  async getContainers(endpointId: string) {
    await this.getEndpointById(endpointId);

    return this.socket.listContainers();
  }

  async getContainerStats(endpointId: string, containerId: string) {
    const container = await this.getContainerById(endpointId, containerId);

    return container.inspect();
  }

  async executeContainerAction(endpointId: string, containerId: string, dto: executeContainerActionDto) {
    const container = await this.getContainerById(endpointId, containerId);
    const { action } = dto;
    switch (action) {
      case DockerContainerActions.Start:
        await container.start();
        break;
      case DockerContainerActions.Stop:
        await container.kill();
        break;
      case DockerContainerActions.Kill:
        await container.kill();
        break;
      case DockerContainerActions.Restart:
        await container.restart();
        break;
      case DockerContainerActions.Pause:
        await container.pause();
        break;
      case DockerContainerActions.Unpause:
        await container.unpause();
        break;
      case DockerContainerActions.Remove:
        await container.remove();
        break;
    }
  }

  async getContainerLogs(endpointId: string, containerId: string) {
    const container = await this.getContainerById(endpointId, containerId);
    const logs = await container.logs({
      stderr: true,
      stdout: true,
    });

    return logs.toString();
  }

  async getContainerById(endpointId: string, containerId: string) {
    await this.getEndpointById(endpointId);

    return this.socket.getContainer(containerId);
  }

  async getNetworks(endpointId: string) {
    await this.getEndpointById(endpointId);

    return this.socket.listNetworks();
  }

  async getNetworkById(endpointId: string, networkId: string) {
    await this.getEndpointById(endpointId);

    return this.socket.getNetwork(networkId);
  }

  async inspectNetwork(endpointId: string, networkId: string) {
    const network = await this.getNetworkById(endpointId, networkId);

    return network.inspect();
  }

  async getVolumes(endpointId: string) {
    await this.getEndpointById(endpointId);
    const { Volumes } = await this.socket.listVolumes();

    return Volumes.length > 0 ? Volumes : [];
  }

  async getVolumeById(endpointId: string, volumeId: string) {
    await this.getEndpointById(endpointId);

    return this.socket.getVolume(volumeId);
  }

  async inspectVolume(endpointId: string, volumeId: string) {
    const volume = await this.getVolumeById(endpointId, volumeId);

    return volume.inspect();
  }

  async getDockerEndpoint(endpoint: Instances, config: string) {
    const { id, type, name } = endpoint;
    const connection = await this.checkConnection(type, config);
    const clusterInfo = await this.getClusterInfo();
    let URL: string;
    const conf = JSON.parse(config);
    if (type === 1) {
      URL = `${conf.host}:${conf.port}`;
    } else {
      URL = conf.socketPath;
    }

    return {
      id,
      name,
      type,
      snapshot: connection ? this.constructSnapshot(clusterInfo) : {},
      status: connection ? 1 : 0,
      URL,
    };
  }
}
