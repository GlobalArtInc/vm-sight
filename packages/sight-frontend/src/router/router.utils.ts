import { getToken } from '@/utils/auth';
import authService from '@/services/auth.service';
import store from '@/store';

interface RouteMetaI {
  title?: string;
  hideInMenu?: boolean;
  type?: string;
}

export class RouteMeta implements RouteMetaI {
  title: string | undefined = '';
  hideInMenu: boolean | undefined = true;
  type: string | undefined = '';

  constructor (data: RouteMetaI) {
    this.title = data.title;
    this.hideInMenu = data.hideInMenu;
    this.type = data.type;
  }
}

export const checkAuth = () => {
  if (getToken()) {
    authService.me().then((user) => {
      return store.dispatch('auth/getInfo', user);
    });
  }
};
