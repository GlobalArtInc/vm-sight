import request from '@/services/http.service';

class EndpointsService {
  getEndpoints () {
    return request.get('/endpoints');
  }

  getEndpoint (endpointId: string) {
    return request.get('/endpoints/' + endpointId);
  }
}

export default new EndpointsService();
