import { RouteConfig } from 'vue-router';
import { userResolver, usersResolver } from '@/resolvers/users.resolver';

const routes: Array<RouteConfig> = [
  {
    path: 'create',
    component: () => import('@/views/users/UsersForm.vue')
  },
  {
    path: ':userId',
    props: true,
    component: () => import('@/views/users/UsersForm.vue'),
    beforeEnter: userResolver
  },
  {
    path: '',
    component: () => import('@/views/users/Index.vue'),
    beforeEnter: usersResolver
  }
];

export default routes;
