import { RouteConfig } from 'vue-router';
import { endpointResolver, endpointsResolver } from '@/resolvers/endpoints.resolver';
import { RouteMeta } from '@/router/router.utils';

const routes: Array<RouteConfig> = [
  {
    path: 'create',
    meta: new RouteMeta({ title: 'endpointsCreate' }),
    component: () => import('@/views/endpoints/EndpointsForm.vue'),
  },
  {
    path: ':endpointId',
    props: true,
    meta: new RouteMeta({ title: 'endpointsEdit' }),
    component: () => import('@/views/endpoints/EndpointsForm.vue'),
    beforeEnter: endpointResolver,
  },
  {
    path: '',
    meta: new RouteMeta({ hideInMenu: true }),
    component: () => import('@/views/endpoints/Index.vue'),
    beforeEnter: endpointsResolver,
  },
];

export default routes;
