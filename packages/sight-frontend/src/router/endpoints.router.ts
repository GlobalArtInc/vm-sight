import { RouteConfig } from 'vue-router';
import { endpointResolver, endpointsResolver } from '@/resolvers/endpoints.resolver';

const routes: Array<RouteConfig> = [
  {
    path: 'create',
    component: () => import('@/views/endpoints/EndpointsForm.vue')
  },
  {
    path: ':endpointId',
    props: true,
    component: () => import('@/views/endpoints/EndpointsForm.vue'),
    beforeEnter: endpointResolver
  },
  {
    path: '',
    component: () => import('@/views/endpoints/Index.vue'),
    beforeEnter: endpointsResolver
  }
];

export default routes;
