import { getToken } from '@/utils/auth';
import authService from '@/services/auth.service';
import store from '@/store';

interface RouteMetaI {
  title?: string;
  hideInMenu?: boolean;
}

export class RouteMeta implements RouteMetaI {
  title: string | undefined = '';
  hideInMenu: boolean | undefined = true;

  constructor (data: RouteMetaI) {
    this.title = data.title;
    this.hideInMenu = data.hideInMenu;
  }
}

export const checkAuth = () => {
  if (getToken()) {
    authService.me().then((user) => {
      return store.dispatch('auth/getInfo', user);
    });
  }
};
