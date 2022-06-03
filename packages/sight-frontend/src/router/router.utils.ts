import { getToken } from '@/utils/auth';
import authService from '@/services/auth.service';
import store from '@/store';

export class RouteMeta {
  title: string;

  constructor ({ title }: { title: string }) {
    this.title = title;
  }
}

export const checkAuth = () => {
  if (getToken()) {
    authService.me().then((user) => {
      return store.dispatch('auth/getInfo', user);
    });
  }
};
