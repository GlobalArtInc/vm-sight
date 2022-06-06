import request from '@/utils/request';

class DockerService {
  getContainers (endpointId: string) {
    return request.get(`/endpoints/${endpointId}/docker/containers`);
  }

  getContainerById (endpointId: string, containerId: string) {
    return request.get(`/endpoints/${endpointId}/docker/containers/${containerId}`);
  }

  execContainerAction (action: string, endpointId: string, containerId: string) {
    if (action === 'remove') {
      return request.delete(`/endpoints/${endpointId}/docker/containers/${containerId}`);
    } else {
      return request.patch(`/endpoints/${endpointId}/docker/containers/${containerId}`, { action });
    }
  }

  getNetworks (endpointId: string) {
    return request.get(`/endpoints/${endpointId}/docker/networks`);
  }

  getNetworkById (endpointId: string, networkId: string) {
    return request.get(`/endpoints/${endpointId}/docker/networks/${networkId}`);
  }

  connectNetwork (endpointId: string, networkId: string, containerId: string) {
    return request.post(`/endpoints/${endpointId}/docker/networks/${networkId}/connect`, {
      Container: containerId
    });
  }

  disconnectNetwork (endpointId: string, networkId: string, containerId: string) {
    return request.post(`/endpoints/${endpointId}/docker/networks/${networkId}/disconnect`, {
      Container: containerId
    });
  }
}

export default new DockerService();
