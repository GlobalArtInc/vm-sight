import BlankLayout from '@/layouts/BlankLayout.vue';
import AuthResolver from '@/resolvers/auth.resolver';

const routes = [
  {
    path: '/auth',
    component: BlankLayout,
    children: [
      {
        path: '',
        component: () => import('@/views/auth/Index.vue'),
        beforeEnter: new AuthResolver().checkAdmin
      }
    ]
  },
  {
    path: '/init',
    component: BlankLayout,
    children: [
      {
        path: 'admin',
        component: () => import('@/views/init/Admin.vue')
      },
      {
        path: 'endpoint',
        component: () => import('@/views/init/Endpoint.vue')
      }
    ]
  }
];

export default routes;
