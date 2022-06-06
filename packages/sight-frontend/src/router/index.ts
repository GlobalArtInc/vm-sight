import Vue from 'vue';
import Router, { NavigationGuardNext, Route } from 'vue-router';
import { getToken } from '@/utils/auth';
import protectedRoutes from '@/router/protected.router';
import publicRouter from '@/router/public.router';
import Blank from '../layouts/Blank.vue';
import { checkAuth, RouteMeta } from '@/router/router.utils';

Vue.use(Router);

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      component: Blank,
      beforeEnter: (to, from, next) => {
        checkAuth();
        next();
      },
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

// This callback runs before every route change, including on initial load
router.beforeEach((to, from, next) => {
  if (whiteList.indexOf(to.path) !== -1) {
    return next();
  } else {
    if (getToken()) {
      if (to.path === '/') return next('/dashboard');
      if (whiteList.indexOf(to.path) < 0) {
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
