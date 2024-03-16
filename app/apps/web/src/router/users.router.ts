import { RouteConfig } from 'vue-router';
import { userResolver, usersResolver } from '@/resolvers/users.resolver';
import { RouteMeta } from '@/router/router.utils';

const routes: Array<RouteConfig> = [
  {
    path: 'create',
    meta: new RouteMeta({ title: 'usersCreate' }),
    component: () => import('@/views/users/UsersForm.vue'),
  },
  {
    path: ':userId',
    props: true,
    meta: new RouteMeta({ title: 'usersEdit' }),
    component: () => import('@/views/users/UsersForm.vue'),
    beforeEnter: userResolver,
  },
  {
    path: '',
    meta: new RouteMeta({ hideInMenu: true }),
    component: () => import('@/views/users/Index.vue'),
    beforeEnter: usersResolver,
  },
];

export default routes;
