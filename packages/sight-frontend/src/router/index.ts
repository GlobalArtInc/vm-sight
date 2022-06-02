import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';
import { getToken } from '@/utils/auth';
import protectedRoutes from '@/router/protected.routes';
import publicRouter from '@/router/public.router';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    ...publicRouter,
    ...protectedRoutes
  ]
});

const whiteList = ['/init/admin', '/init/endpoint'];
// This callback runs before every route change, including on initial load
router.beforeEach((to, from, next) => {
  if (whiteList.indexOf(to.path) !== -1) {
    next();
  } else {
    if (getToken()) {
      if (to.path === '/') next('/dashboard');
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      if (whiteList.includes(to.path) !== -1) {
        next();
      } else {
        next('/dashboard');
      }
      next();
    } else {
      if (to.path !== '/auth') { next('/auth'); } else next();
    }
  }
  next();
});

export default router;
