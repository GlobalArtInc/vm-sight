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
        path: '/auth',
        component: BlankLayout,
        children: [
            {
              path: 'init',
              component: () => import('@/views/Auth/Init')
            },
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


