import MainLayout from '../layouts/MainLayout.vue';
import DockerLayout from '../layouts/DockerLayout.vue';
import { RouteConfig } from 'vue-router';
import { endpointsResolver } from '@/resolvers/endpoints.resolver';
import usersRouter from '@/router/users.router';
import endpointsRouter from '@/router/endpoints.router';
import dockerRouter from '@/router/docker.router';

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
    path: '/endpoints',
    name: 'Endpoints',
    component: MainLayout,
    children: [
      ...endpointsRouter
    ]
  },
  {
    path: '/:endpointId',
    props: true,
    component: MainLayout,
    children: [
      {
        path: 'docker',
        component: DockerLayout,
        props: true,
        meta: {
          type: 'endpointDocker'
        },
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
