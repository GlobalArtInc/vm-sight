import { RouteConfig } from 'vue-router';
import { RouteMeta } from '@/router/router.utils';
import Blank from '@/layouts/Blank.vue';
import { dockerResolver } from '@/resolvers/docker.resolver';

const containersRouter: Array<RouteConfig> = [
  {
    path: ':id',
    meta: new RouteMeta({ title: 'container', type: 'endpointDocker' }),
    component: () => import('@/views/docker/containers/Edit.vue'),
    beforeEnter: (to, from, next) => dockerResolver(['endpoint', 'container', 'networks'], to, from, next)
  },
  {
    path: ':id/logs',
    meta: new RouteMeta({ title: 'containerLogs', type: 'endpointDocker' }),
    component: () => import('@/views/docker/containers/Logs.vue'),
    beforeEnter: (to, from, next) => dockerResolver(['endpoint', 'container'], to, from, next)
  },
  {
    path: '',
    meta: new RouteMeta({ hideInMenu: true }),
    component: () => import('@/views/docker/containers/Index.vue'),
    beforeEnter: (to, from, next) => dockerResolver(['endpoint', 'containers'], to, from, next)
  }
];

const networksRouter: Array<RouteConfig> = [
  {
    path: '',
    meta: new RouteMeta({ hideInMenu: true }),
    component: () => import('@/views/docker/networks/Index.vue'),
    beforeEnter: (to, from, next) => dockerResolver(['endpoint', 'networks'], to, from, next)
  }
];

const routes: Array<RouteConfig> = [
  {
    path: 'dashboard',
    meta: new RouteMeta({ hideInMenu: true, type: 'endpointDocker' }),
    props: true,
    beforeEnter: (to, from, next) => dockerResolver(['endpoint', 'networks'], to, from, next),
    component: () => import('@/views/docker/Dashboard.vue')
  },
  {
    path: 'containers',
    props: true,
    meta: new RouteMeta({ title: 'containers', type: 'endpointDocker' }),
    component: Blank,
    children: [
      ...containersRouter
    ]
  },
  {
    path: 'networks',
    props: true,
    meta: new RouteMeta({ title: 'networks', type: 'endpointDocker' }),
    component: Blank,
    children: [
      ...networksRouter
    ]
  }
];

export default routes;
