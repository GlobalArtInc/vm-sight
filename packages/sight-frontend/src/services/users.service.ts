import request from '@/utils/request';

class UsersService {
  getUsers () {
    return request.get('/users');
  }

  getUser (userId: string) {
    return request.get('/users/' + userId);
  }

  createUser (userData: object) {
    return request.post('/users', userData);
  }

  updateUser (userId: string, userData: object) {
    return request.put('/users/' + userId, userData);
  }

  deleteUser (userId: string) {
    return request.delete('/users/' + userId);
  }
}

export default new UsersService();
