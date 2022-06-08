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

const imagesRouter: Array<RouteConfig> = [
  {
    path: '',
    meta: new RouteMeta({ hideInMenu: true }),
    component: () => import('@/views/docker/images/Index.vue'),
    beforeEnter: (to, from, next) => dockerResolver(['endpoint', 'images'], to, from, next)
  }
];

const volumesRouter: Array<RouteConfig> = [
  {
    path: '',
    name: 'dockerVolumes',
    meta: new RouteMeta({ title: 'volumes', type: 'endpointDocker' }),
    beforeEnter: (to, from, next) => dockerResolver(['volumes'], to, from, next),
    component: () => import('@/views/docker/volumes/Index.vue')
  }
];

const networksRouter: Array<RouteConfig> = [
  {
    path: 'create',
    name: 'networksCreate',
    meta: new RouteMeta({ title: 'networksCreate', type: 'endpointDocker' }),
    component: () => import('@/views/docker/networks/Create.vue')
  },
  {
    path: ':id',
    name: 'networksView',
    meta: new RouteMeta({ title: 'networksEdit', type: 'endpointDocker' }),
    component: () => import('@/views/docker/networks/Edit.vue'),
    beforeEnter: (to, from, next) => dockerResolver(['endpoint', 'network'], to, from, next)
  },
  {
    path: '',
    name: 'networks',
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
    beforeEnter: (to, from, next) => dockerResolver(['endpoint'], to, from, next),
    children: [
      ...containersRouter
    ]
  },
  {
    path: 'images',
    props: true,
    meta: new RouteMeta({ title: 'images', type: 'endpointDocker' }),
    component: Blank,
    beforeEnter: (to, from, next) => dockerResolver(['endpoint'], to, from, next),
    children: [
      ...imagesRouter
    ]
  },
  {
    path: 'volumes',
    props: true,
    meta: new RouteMeta({ title: 'volumes', type: 'endpointDocker' }),
    component: Blank,
    beforeEnter: (to, from, next) => dockerResolver(['endpoint'], to, from, next),
    children: [
      ...volumesRouter
    ]
  },
  {
    path: 'networks',
    props: true,
    meta: new RouteMeta({ title: 'networks', type: 'endpointDocker' }),
    component: Blank,
    beforeEnter: (to, from, next) => dockerResolver(['endpoint'], to, from, next),
    children: [
      ...networksRouter
    ]
  }
];

export default routes;
