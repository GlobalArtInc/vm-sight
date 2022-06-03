import request from '@/utils/request';

class EndpointsService {
  getEndpoints () {
    return request.get('/endpoints');
  }

  getEndpoint (endpointId: string) {
    return request.get('/endpoints/' + endpointId);
  }
}

export default new EndpointsService();
