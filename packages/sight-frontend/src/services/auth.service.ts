import request from '@/utils/request';

class AuthService {
  async login (username: string, password: string) {
    return request.post('/auth', { username, password });
  }

  async me () {
    return request.get('/me');
  }

  async checkAdmin () {
    return request.get('/users/admin/check');
  }

  async initAdmin (username: string, password: string) {
    return request.post('/users/admin/init', { username, password });
  }
}

export default new AuthService();
