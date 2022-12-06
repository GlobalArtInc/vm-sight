import request from '@/utils/request';

class AuthService {
  async login (username: string, password: string) {
    return request.post('/auth/login', { username, password });
  }

  async logout () {
    return request.post('/auth/logout');
  }

  async me () {
    return request.get('/auth/me');
  }

  async checkAdmin () {
    return request.get('/users/admin/check');
  }

  async initAdmin (username: string, password: string) {
    return request.post('/users/admin/init', { username, password });
  }
}

export default new AuthService();
