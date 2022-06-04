import { RouteConfig } from 'vue-router';

const routes: Array<RouteConfig> = [
  {
    path: 'dashboard',
    props: true,
    component: () => import('@/views/docker/Dashboard.vue')
  }
];

export default routes;
