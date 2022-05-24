import Docker from 'dockerode';
import { EndpointsModel } from '@models';
import { BadRequestException, ForbiddenException, NotFoundException } from '@exceptions';

interface tls {
  active?: boolean;
  ca: boolean;
  cert: boolean;
  key: boolean;
}

export class DockerService {
  public service: { endpoint: any; docker: Docker };

  /**
   * Connect to the docker server or via docker socket
   * @param host
   * @param tls
   */
  public checkConnect(tempId: string | number, host: string, tls: tls) {
    const settings: any = host.match('/var/run/docker.sock')
      ? { socketPath: '/var/run/docker.sock' }
      : {
          host: host.split(':')[0],
          port: host.split(':')[1],
        };
    if (tls.ca) {
      settings.ca = tls.ca;
    }
    if (tls.cert) {
      settings.cert = tls.cert;
    }
    if (tls.key) {
      settings.key = tls.key;
    }

    return new Promise((resolve, reject) => {
      if (settings.host && !settings.port) reject();
      const docker = new Docker(settings);
      docker
        .version()
        .then(response => {
          resolve({ response, docker });
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  public async getEndpoint() {
    const endpoint = this.service.endpoint;
    const info = await this.service.docker.info();

    const snapshot = this.constructSnapshot({
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

    return {
      id: endpoint.id,
      name: endpoint.name,
      type: endpoint.type,
      groupId: endpoint.groupId,
      status: 1,
      public_url: endpoint.public_url,
      url: endpoint.url,
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
    if (!endpoint) throw new NotFoundException('The endpoint was not found');
    const connect: any = await this.checkConnect(endpointId, endpoint.url, {
      active: endpoint.tls,
      ca: endpoint.tls_ca,
      cert: endpoint.tls_cert,
      key: endpoint.tls_key,
    });
    this.service = { endpoint, docker: connect.docker };
    return true;
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
    const contaienr = await this.service.docker.getContainer(containerId);
    return contaienr.inspect();
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
        return container.remove();
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

  public async removeNetworkById(endpointId: string, networkId: string) {
    await this.connect(endpointId);
    const network = await this.service.docker.getNetwork(networkId);
    return network.remove();
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
