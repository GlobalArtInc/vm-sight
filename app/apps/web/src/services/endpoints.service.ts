import request from '@/utils/request';

class EndpointsService {
  getEndpoints() {
    return request.get('/endpoints');
  }

  getEndpoint(endpointId: string) {
    return request.get('/endpoints/' + endpointId);
  }

  deleteEndpoint(endpointId: string) {
    return request.delete('/endpoints/' + endpointId);
  }

  createEndpoint(endpointData: object) {
    return request.post('/endpoints', endpointData);
  }

  updateEndpoint(endpointId: string, endpointData: object) {
    return request.put('/endpoints/' + endpointId, endpointData);
  }
}

export default new EndpointsService();
