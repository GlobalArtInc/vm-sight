import Docker from 'dockerode';
import { EndpointsModel } from '@models';

interface tls {
  active: boolean;
  ca: boolean;
  cert: boolean;
  key: boolean;
}

export class DockerService {
  public service;

  /**
   * Connect to the docker server or via docker socket
   * @param host
   * @param tls
   */
  public checkConnect(host: string, tls: tls) {
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
    const connect: any = await this.checkConnect(endpoint.url, {
      active: endpoint.tls,
      ca: endpoint.tls_ca,
      cert: endpoint.tls_cert,
      key: endpoint.tls_key,
    });
    this.service = { endpoint, docker: connect.docker };
    return true;
  }
}

export default DockerService;
