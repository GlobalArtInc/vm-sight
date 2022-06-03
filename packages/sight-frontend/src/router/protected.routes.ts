import MainLayout from '../layouts/MainLayout.vue';
import { RouteConfig } from 'vue-router';
import { endpointsResolver } from '@/resolvers/endpoints.resolver';
import usersRouter from '@/router/users.router';

const routes: Array<RouteConfig> = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: MainLayout,
    children: [
      {
        path: '',
        component: () => import('../views/Dashboard.vue'),
        beforeEnter: endpointsResolver
      }
    ]
  },
  {
    path: '/users',
    name: 'Users',
    component: MainLayout,
    children: [
      ...usersRouter
    ]
  },
  {
    path: '/:catchAll(.*)',
    name: 'notFound',
    component: () => import('../views/errors/NotFound.vue')
  }
];

export default routes;
