import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/layouts/Layout'
import BlankLayout from '@/layouts/BlankLayout'

Vue.use(Router)

export const publicRoute = [
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

export const protectedRoute = [
    {
        path: '/',
        redirect: '/home',
        component: Layout,
        children: [
            {
                meta: {
                    title: 'dashboard',
                    group: 'apps',
                    icon: 'mdi-view-dashboard'
                },
                path: '/home',
                name: 'home',
                component: () => import('@/views/Home')
            }
        ]
    },
    {
        path: '/init',
        meta: {
            title: 'home',
            group: 'apps',
            icon: ''
        },
        component: BlankLayout,
        children: [
            {
                meta: {
                    title: 'home',
                    group: 'apps',
                    icon: ''
                },
                path: 'endpoint',
                component: () => import('@/views/Init/Endpoint')
            },
            {
                meta: {
                    title: 'home',
                    group: 'apps',
                    icon: ''
                },
                path: 'admin',
                component: () => import('@/views/Init/Admin')
            }
        ]
    }
]


const routes = publicRoute.concat(protectedRoute)

const router = new Router({
    mode: 'hash',
    linkActiveClass: 'active',
    routes: routes
})

export default router

