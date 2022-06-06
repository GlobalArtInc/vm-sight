import MainLayout from '../layouts/MainLayout.vue';
import DockerLayout from '../layouts/DockerLayout.vue';
import { RouteConfig } from 'vue-router';
import { endpointsResolver } from '@/resolvers/endpoints.resolver';
import usersRouter from '@/router/users.router';
import endpointsRouter from '@/router/endpoints.router';
import dockerRouter from '@/router/docker.router';
import { RouteMeta } from '@/router/router.utils';

const routes: Array<RouteConfig> = [
  {
    path: 'dashboard',
    name: 'Dashboard',
    component: MainLayout,
    meta: new RouteMeta({ hideInMenu: true }),
    children: [
      {
        path: '',
        meta: new RouteMeta({ hideInMenu: true }),
        component: () => import('../views/Dashboard.vue'),
        beforeEnter: endpointsResolver
      }
    ]
  },
  {
    path: 'users',
    name: 'Users',
    meta: new RouteMeta({ title: 'users' }),
    component: MainLayout,
    children: [
      ...usersRouter
    ]
  },
  {
    path: 'endpoints',
    name: 'Endpoints',
    meta: new RouteMeta({ title: 'endpoints' }),
    component: MainLayout,
    children: [
      ...endpointsRouter
    ]
  },
  {
    path: ':endpointId',
    props: true,
    meta: new RouteMeta({ hideInMenu: true }),
    component: MainLayout,
    children: [
      {
        path: 'docker',
        component: DockerLayout,
        props: true,
        meta: new RouteMeta({ title: 'docker', type: 'endpointDocker' }),
        redirect: 'docker/dashboard',
        children: [
          ...dockerRouter
        ]
      }
    ]
  },
  {
    path: '/:catchAll(.*)',
    name: 'notFound',
    component: () => import('../views/errors/NotFound.vue')
  }
];

export default routes;
