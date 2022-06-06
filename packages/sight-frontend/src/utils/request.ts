import axios from 'axios';
import { getToken } from '@/utils/auth';
import router from '@/router';

const request = axios.create({
  baseURL: '/api',
  withCredentials: true
});

request.interceptors.request.use(
  config => {
    if (config.headers) {
      config.headers.Authorization = 'Bearer ' + getToken();
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.response === false) {
      return Promise.reject(res);
    } else {
      return Promise.resolve(res);
    }
  }, async (error) => {
    if (error.response.status === 401) {
      await router.push('/auth');
    } else {
      return Promise.reject(error);
    }
  }
);

export default request;
