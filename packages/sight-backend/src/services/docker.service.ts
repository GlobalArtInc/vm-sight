import Docker from 'dockerode';
import { EndpointsModel } from '@models';
import { BadRequestException, NotFoundException } from '@exceptions';
import { isWindows } from '@utils/util';
import { CreateNetworkDto } from '@dtos/docker.dto';

// tslint:disable:no-var-requires

export class DockerService {
  public service: { endpoint: any; docker: any };

  /**
   * Connect to the docker server or via docker socket
   * @param data
   * @param onCreate
   */
  public async checkConnect(data, onCreate = false) {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const settings: Docker.Settings =
        data.type === 2
          ? { socketPath: isWindows() ? '//./pipe/docker_engine' : '/var/run/docker.sock' }
          : {
              host: data?.host?.split(':')[0] ?? '',
              port: data?.host?.split(':')[1] ?? '',
            };
      settings.ca = data.ca ?? '';
      settings.cert = data.cert ?? '';
      settings.key = data.key ?? '';
      const docker = new Docker(settings),
        version = await docker.version();
      return Promise.resolve({ version, docker });
    } catch (err) {
      if (onCreate === true) return Promise.reject(err);
      else return Promise.resolve('no_connection');
    }
  }

  public async getEndpoint() {
    const endpoint = this.service.endpoint;

    let snapshot = {};
    if (this.service.docker) {
      const info = await this.service.docker.info();

      snapshot = this.constructSnapshot({
        DockerVersion: info.ServerVersion,
        Containers: info.Containers,
        RunningContainerCount: info.ContainersRunning,
        StoppedContainerCount: info.ContainersStopped,
        HealthyContainerCount: 0,
        UnhealthyContainerCount: 0,
        ImageCount: 0,
        ServiceCount: 0,
        StackCount: 0,
        Swarm: 'active',
        Time: Math.floor(new Date(info.SystemTime).getTime() / 1000),
        TotalCPU: info.NCPU,
        TotalMemory: info.MemTotal,
        VolumeCount: 0,
      });
    }
    return {
      id: endpoint.id,
      name: endpoint.name,
      type: endpoint.type,
      groupId: endpoint.groupId,
      status: this.service.docker ? 1 : 0,
      public_url: endpoint.public_url,
      host: endpoint.type === 2 ? (isWindows() ? '//./pipe/docker_engine' : '/var/run/docker.sock') : endpoint.host,
      tls: endpoint.tls,
      tls_ca: endpoint.tls_ca,
      tls_cert: endpoint.tls_cert,
      tls_key: endpoint.tls_key,
      snapshot,
    };
  }

  public constructSnapshot(data) {
    return {
      DockerVersion: data.DockerVersion ? data.DockerVersion : '',
      Containers: data.Containers ? data.Containers : 0,
      RunningContainerCount: data.ContainersRunning ? data.ContainersRunning : 0,
      StoppedContainerCount: data.ContainersStopped ? data.ContainersStopped : 0,
      HealthyContainerCount: data.HealthyContainerCount ? data.HealthyContainerCount : 0,
      UnhealthyContainerCount: data.UnhealthyContainerCount ? data.UnhealthyContainerCount : 0,
      ImageCount: data.ImageCount ? data.ImageCount : 0,
      ServiceCount: data.ServiceCount ? data.ServiceCount : 0,
      StackCount: data.StackCount ? data.StackCount : 0,
      Swarm: data.Swarm ? data.Swarm : false,
      Time: data.Time ? data.Time : 0,
      TotalCPU: data.TotalCPU ? data.TotalCPU : 0,
      TotalMemory: data.TotalMemory ? data.TotalMemory : 0,
      VolumeCount: data.VolumeCount ? data.VolumeCount : 0,
    };
  }

  public async connect(endpointId: string) {
    const endpoint = await EndpointsModel.findOne({
      where: { id: endpointId },
    });
    if (!endpoint) throw new NotFoundException('Endpoint not found');
    try {
      const connect: any = await this.checkConnect(endpoint);
      this.service = { endpoint, docker: connect.docker };
    } catch (err) {
      this.service = { endpoint, docker: false };
    }
  }

  public async getContainers(endpointId: string) {
    await this.connect(endpointId);
    const containers = await this.service.docker.listContainers({ all: 1 });
    containers.reduce((acc, current) => {
      current.Name = current.Names[0].slice(1);
      delete current.Names;
      return acc;
    }, undefined);
    containers.sort((a, b) => {
      return a.Created - b.Created;
    });
    return containers;
  }

  public async getContainer(endpointId: string, containerId: string) {
    await this.connect(endpointId);
    const container = await this.service.docker.getContainer(containerId);
    return container.inspect();
  }

  public async updateContainer(endpointId: string, containerId: string, body: object) {
    await this.connect(endpointId);
    const container = await this.service.docker.getContainer(containerId);
    return container.update(body);
  }

  public async getContainerLogs(endpointId: string, containerId: string, query: object) {
    await this.connect(endpointId);
    const container = await this.service.docker.getContainer(containerId);
    return container.logs(query);
  }

  public async containerAction(action, endpointId: string, containerId: string) {
    await this.connect(endpointId);
    const container = await this.service.docker.getContainer(containerId);
    switch (action) {
      case 'start':
        return container.start();
      case 'stop':
        return container.stop();
      case 'kill':
        return container.kill();
      case 'restart':
        return container.restart();
      case 'pause':
        return container.pause();
      case 'resume':
        return container.unpause();
      case 'remove':
        return container.remove({ force: true });
      default:
        throw new BadRequestException('No action found');
    }
  }

  public async getNetworks(endpointId: string) {
    await this.connect(endpointId);
    const networks = await this.service.docker.listNetworks();
    networks.sort((a, b) => {
      return new Date(b.Created).valueOf() - new Date(a.Created).valueOf();
    });
    return networks;
  }

  public async getNetworkById(endpointId: string, networkId: string) {
    await this.connect(endpointId);
    const network = await this.service.docker.getNetwork(networkId);
    return network.inspect();
  }

  public async createNetwork(endpointId: string, networkData: CreateNetworkDto) {
    await this.connect(endpointId);
    await this.service.docker.createNetwork(networkData);
    return true;
  }

  public async removeNetworkById(endpointId: string, networkId: string) {
    await this.connect(endpointId);
    const network = await this.service.docker.getNetwork(networkId);
    return network.remove();
  }

  public async connectNetwork(endpointId: string, networkId: string, Container: string) {
    await this.connect(endpointId);
    const network = await this.service.docker.getNetwork(networkId);
    return network.connect({ Container, Force: true });
  }

  public async disconnectNetwork(endpointId: string, networkId: string, Container: string) {
    await this.connect(endpointId);
    const network = await this.service.docker.getNetwork(networkId);
    return network.disconnect({ Container, Force: true });
  }

  public async getImages(endpointId: string) {
    await this.connect(endpointId);
    return this.service.docker.listImages();
  }

  public async getImageById(endpointId: string, imageId: string) {
    await this.connect(endpointId);
    const image = await this.service.docker.getImage(imageId);
    return image.inspect();
  }

  public async getImageHistoryById(endpointId: string, imageId: string) {
    await this.connect(endpointId);
    const image = await this.service.docker.getImage(imageId);
    return image.history();
  }

  public async removeImageById(endpointId: string, imageId: string) {
    await this.connect(endpointId);
    const image = await this.service.docker.getImage(imageId);
    return image.remove();
  }
}

export default DockerService;
