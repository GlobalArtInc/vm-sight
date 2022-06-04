import Vue from 'vue';
import Router, { NavigationGuardNext, Route } from 'vue-router';
import { getToken } from '@/utils/auth';
import protectedRoutes from '@/router/protected.router';
import publicRouter from '@/router/public.router';
import Blank from '../layouts/Blank.vue';
import { checkAuth, RouteMeta } from '@/router/router.utils';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      component: Blank,
      meta: new RouteMeta({ title: 'home' }),
      // beforeEnter (to, from, next) {
      //  checkAuth();
      //  next();
      // },
      children: [
        ...publicRouter,
        ...protectedRoutes
      ]
    }
  ]
});

const whiteList = ['/init/admin', '/init/endpoint'];

router.beforeResolve((to: Route, from: Route, next: NavigationGuardNext) => {
  // preload resolve
  // console.log('test');
  next();
});

router.beforeEach(async (to, from, next) => {
  await checkAuth();
  return next();
});

// This callback runs before every route change, including on initial load
router.beforeEach((to, from, next) => {
  if (whiteList.indexOf(to.path) !== -1) {
    return next();
  } else {
    if (getToken()) {
      if (to.path === '/') return next('/dashboard');
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      if (whiteList.includes(to.path) !== -1) {
        return next();
      } else {
        return next('/dashboard');
      }
    } else {
      if (to.path !== '/auth') {
        return next('/auth');
      } else {
        return next();
      }
    }
  }
});

export default router;
