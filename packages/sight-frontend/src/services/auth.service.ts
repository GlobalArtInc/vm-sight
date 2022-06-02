import request from '@/services/http.service';

class AuthService {
  async login (username: string, password: string) {
    return request.request({
      method: 'post',
      url: 'auth',
      data: { username, password }
    });
  }

  async me () {
    return request.get('/me');
  }
}

export default new AuthService();
