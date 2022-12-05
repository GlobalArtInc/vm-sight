import { Injectable, Inject, forwardRef, NotFoundException } from '@nestjs/common';
import { Instances } from 'src/instances/instances.entity';
import * as Docker from 'dockerode';
import { InstancesService } from 'src/instances/instances.service';

@Injectable()
export class DockerService {
  constructor(@Inject(forwardRef(() => InstancesService)) private readonly instancesService: InstancesService) {}

  protected socket: Docker;
  protected endpoint: Instances;

  async checkConnect(instance: Instances, config: string) {
    try {
      const { type } = instance;
      const conf = JSON.parse(config);
      if (type === 2) {
        this.socket = new Docker({
          socketPath: '/var/run/docker.sock',
          timeout: 500,
        });
      } else {
        this.socket = new Docker({
          host: conf?.host,
          port: conf?.port,
          timeout: 500,
        });
      }

      return this.socket
        .version()
        .then(() => {
          return true;
        })
        .catch(() => {
          return false;
        });
    } catch (err) {
      return false;
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

  async getEndpointById(endpointId: number) {
    const [endpoint, config] = await Promise.all([
      this.instancesService.getById(endpointId),
      this.instancesService.getConfigById(endpointId),
    ]);
    if (!endpoint || !config) {
      throw new NotFoundException('endpoint_not_found');
    }
    await this.checkConnect(endpoint, config);

    return endpoint;
  }

  async getInfo(endpointId: number) {
    await this.getEndpointById(endpointId);

    return this.socket.info();
  }

  async getVersion(endpointId: number) {
    await this.getEndpointById(endpointId);

    return this.socket.version();
  }

  async getContainers(endpointId: number) {
    await this.getEndpointById(endpointId);

    return this.socket.listContainers();
  }

  async getContainerStats(endpointId: number, containerId: string) {
    const container = await this.getContainerById(endpointId, containerId);

    return container.inspect();
  }

  async getContainerLogs(endpointId: number, containerId: string) {
    const container = await this.getContainerById(endpointId, containerId);
    const logs = await container.logs({
      stderr: true,
      stdout: true,
    });

    return logs.toString();
  }

  async getContainerById(endpointId: number, containerId: string) {
    await this.getEndpointById(endpointId);

    return this.socket.getContainer(containerId);
  }

  async getNetworks(endpointId: number) {
    await this.getEndpointById(endpointId);

    return this.socket.listNetworks();
  }

  async getNetworkById(endpointId: number, networkId: string) {
    await this.getEndpointById(endpointId);

    return this.socket.getNetwork(networkId);
  }

  async inspectNetwork(endpointId: number, networkId: string) {
    const network = await this.getNetworkById(endpointId, networkId);

    return network.inspect();
  }

  async getVolumes(endpointId: number) {
    await this.getEndpointById(endpointId);
    const { Volumes } = await this.socket.listVolumes();

    return Volumes.length > 0 ? Volumes : [];
  }

  async getVolumeById(endpointId: number, volumeId: string) {
    await this.getEndpointById(endpointId);

    return this.socket.getVolume(volumeId);
  }

  async inspectVolume(endpointId: number, volumeId: string) {
    const volume = await this.getVolumeById(endpointId, volumeId);

    return volume.inspect();
  }

  async getDockerEndpoint(endpoint: Instances, config: string) {
    const { id, type, name } = endpoint;
    const connection = await this.checkConnect(endpoint, config);
    const clusterInfo = await this.getClusterInfo();
    let URL: string;
    const conf = JSON.parse(config);
    if (type === 1) {
      URL = `${conf.host}:${conf.port}`;
    } else {
      URL = conf.socketPath;
    }

    return {
      Id: id,
      Name: name,
      Type: type,
      Snapshot: connection ? this.constructSnapshot(clusterInfo) : {},
      Status: connection ? 1 : 0,
      URL,
    };
  }
}
