import request, { createUrl } from '@/utils/request';

class DockerService {
  getContainers (endpointId: string) {
    return request.get(`/endpoints/${endpointId}/docker/containers`);
  }

  getContainerById (endpointId: string, containerId: string) {
    return request.get(`/endpoints/${endpointId}/docker/containers/${containerId}`);
  }

  updateContainer (endpointId: string, containerId: string, data: object) {
    return request.put(`/endpoints/${endpointId}/docker/containers/${containerId}`, data);
  }

  execContainerAction (action: string, endpointId: string, containerId: string) {
    if (action === 'remove') {
      return request.delete(`/endpoints/${endpointId}/docker/containers/${containerId}`);
    } else {
      return request.patch(`/endpoints/${endpointId}/docker/containers/${containerId}`, { action });
    }
  }

  getVolumes (endpointId: string) {
    return request.get(`/endpoints/${endpointId}/docker/volumes`);
  }

  removeVolumeById (endpointId: string, volumeId: string) {
    return request.delete(`/endpoints/${endpointId}/docker/volumes/${volumeId}`);
  }

  getNetworks (endpointId: string) {
    return request.get(`/endpoints/${endpointId}/docker/networks`);
  }

  getNetworkById (endpointId: string, networkId: string) {
    return request.get(`/endpoints/${endpointId}/docker/networks/${networkId}`);
  }

  removeNetwork (endpointId: string, networkId: string) {
    return request.delete(`/endpoints/${endpointId}/docker/networks/${networkId}`);
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

  getImages (endpointId: string) {
    return request.get(`/endpoints/${endpointId}/docker/images`);
  }

  getLogs (endpointId: string, containerId: string, options: object) {
    return request.get(`/endpoints/${endpointId}/docker/containers/${containerId}/logs?${createUrl(options)}`);
  }
}

export default new DockerService();
