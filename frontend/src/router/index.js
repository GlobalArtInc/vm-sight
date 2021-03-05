import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/layouts/Layout'
import BlankLayout from '@/layouts/BlankLayout'

Vue.use(Router)

export const routes = [
    {
        path: '/',
        component: Layout,
        children: [
            {
                path: '',
                component: () => import('@/views/Home')
            }
        ]
    },
    {
      path: '/home',
      component: Layout,
      children: [
          {
              path: '',
              component: () => import('@/views/Home')
          }
      ]
    },
    {
        path: '/init',
        component: BlankLayout,
        children: [
            {
                path: 'endpoint',
                component: () => import('@/views/Init/Endpoint')
            },
            {
                path: 'admin',
                component: () => import('@/views/Init/Admin')
            }
        ]
    },
    {
        path: '/auth',
        component: BlankLayout,
        children: [
            {
                path: '',
                component: () => import('@/views/Auth/Index')
            }
        ]
    }
]

const createRouter = () =>
    new Router({
        mode: "hash",
        scrollBehavior: () => ({y: 0}),
        routes
    })

const router = createRouter()

export default router


