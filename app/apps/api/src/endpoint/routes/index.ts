import { Injectable } from '@nestjs/common';
import { DockerService } from './docker.service';

@Injectable()
export class EndpointsRoute {
  private routes: { [key: string]: string } = {
    local_docker: 'dockerService',
    remote_docker: 'dockerService',
    k8s_cluster: 'k8sClusterService',
  };

  constructor(private readonly dockerService: DockerService) {}

  route(connectionType: string) {
    const serviceName = this.routes[connectionType];
    if (!serviceName) {
      throw new Error(`Service not found for connection type: ${connectionType}`);
    }

    switch (serviceName) {
      case 'dockerService':
        return this.dockerService;
      default:
        throw new Error(`Unknown service name: ${serviceName}`);
    }
  }
}
