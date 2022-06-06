import BlankLayout from '@/layouts/BlankLayout.vue';

const routes = [
  {
    path: '/auth',
    component: BlankLayout,
    children: [
      {
        path: '',
        component: () => import('../views/auth/Index.vue')
      }
    ]
  }
];

export default routes;
