import { Injectable } from '@nestjs/common';
import { Instances } from 'src/instances/instances.entity';
import * as Docker from 'dockerode';
import { InstancesService } from 'src/instances/instances.service';

@Injectable()
export class DockerService {
  constructor(private readonly instancesService: InstancesService) {}

  protected socket: Docker;
  protected endpoint: Instances;

  async checkConnect(instance: Instances, config: string) {
    try {
      const { type } = instance;
      const conf = JSON.parse(config);
      if (type === 2) {
        this.socket = new Docker({
          socketPath: '/var/run/docker.sock',
        });
      } else {
        this.socket = new Docker({
          host: conf?.host,
          port: conf?.port,
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

  async getInfo(endpointId: number) {
    //
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
