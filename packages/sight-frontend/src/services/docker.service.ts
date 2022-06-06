import request from '@/utils/request';

class DockerService {
  getContainers (endpointId: string) {
    return request.get(`/endpoints/${endpointId}/docker/containers`);
  }

  getContainerById (endpointId: string, containerId: string) {
    return request.get(`/endpoints/${endpointId}/docker/containers/${containerId}`);
  }

  execContainerAction (action: string, endpointId: string, containerId: string) {
    return request.patch(`/endpoints/${endpointId}/docker/containers/${containerId}`, { action });
  }

  getNetworks (endpointId: string) {
    return request.get(`/endpoints/${endpointId}/docker/networks`);
  }

  getNetworkById (endpointId: string, networkId: string) {
    return request.get(`/endpoints/${endpointId}/docker/networks/${networkId}`);
  }
}

export default new DockerService();
