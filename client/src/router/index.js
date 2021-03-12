import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/layouts/Layout'
// eslint-disable-next-line no-unused-vars
import DockerLayout from '@/layouts/DockerLayout'
import BlankLayout from '@/layouts/BlankLayout'
import Blank from '@/layouts/Blank'

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
        path: '*',
        component: () => import('@/views/error/NotFound.vue')
    },
    {
        path: '/',
        redirect: '/home',
        component: Layout,
        meta: {
            title: 'home',
            group: 'apps',
            icon: ''
        },
        children: [
            {
                path: 'home',
                name: 'home',
                meta: {
                    title: 'dashboard',
                    group: 'apps',
                    icon: 'mdi-view-dashboard',
                    hiddenInMenu: true
                },
                component: () => import('@/views/Home'),
            },
            {
                name: 'endpointDocker',
                path: ':id/docker',
                redirect: ':id/docker/dashboard',
                component: DockerLayout,
                meta: {
                    title: 'docker',
                    type: 'endpointDocker'
                },
                children: [
                    {
                        name: 'endpointDockerDashboard',
                        path: 'dashboard',
                        meta: {
                            title: 'dashboard',
                            group: 'apps',
                            icon: 'fab fa-docker',
                            hiddenInMenu: true,
                            type: 'endpointDocker'
                        },
                        props: route => ({id: route.params.id}),
                        component: () => import('@/views/Docker/Dashboard/Index')
                    },
                    {
                        path: 'containers',
                        meta: {
                            title: 'containers',
                            type: 'endpointDocker'
                        },
                        component: Blank,
                        children: [
                            {
                                name: 'containerDocker',
                                path: ':hash',
                                meta: {
                                    title: 'edit',
                                    type: 'endpointDocker'
                                },
                                props: true,
                                component: Blank,
                                children: [
                                    {
                                        path: 'logs',
                                        meta: {
                                            title: 'logs',
                                            type: 'endpointDocker'
                                        },
                                        props: true,
                                        component: () => import('@/views/Docker/Containers/Logs'),
                                    },
                                    {
                                        name: 'containerDockerEdit',
                                        path: '',
                                        meta: {
                                            title: 'edit',
                                            type: 'endpointDocker',
                                            hiddenInMenu: true
                                        },
                                        props: true,
                                        component: () => import('@/views/Docker/Containers/Edit'),
                                    }
                                ]
                            },
                            {
                                name: 'containersDockerList',
                                path: '/',
                                meta: {
                                    title: 'list',
                                    type: 'endpointDocker',
                                    hiddenInMenu: true
                                },
                                props: true,
                                component: () => import('@/views/Docker/Containers/Index')
                            }
                        ]
                    }
                ]
            },
            {
                path: '/users',
                component: Blank,
                meta: {
                    title: 'users'
                },
                children: [
                    {
                        path: 'create',
                        name: 'usersCreate',
                        meta: {
                            title: 'usersCreate'
                        },
                        component: () => import('@/views/Users/UserItem')
                    },
                    {
                        path: ':id',
                        name: 'usersEdit',
                        meta: {
                            title: 'usersEdit'
                        },
                        props: true,
                        component: () => import('@/views/Users/UserItem')
                    },
                    {
                        path: '',
                        name: 'usersList',
                        meta: {
                            hiddenInMenu: true
                        },
                        component: () => import('@/views/Users/Index')
                    }
                ]
            },
            {
                path: '/endpoints',
                component: Blank,
                meta: {
                    title: "endpoints"
                },
                children: [
                    {
                        path: 'create',
                        name: 'endpointsCreate',
                        meta: {
                            title: 'endpointsCreate'
                        },
                        props: true,
                        component: () => import('@/views/Endpoints/CreateItem')
                    },
                    {
                        path: ':id',
                        name: 'endpointsEdit',
                        meta: {
                            title: 'endpointsEdit'
                        },
                        props: true,
                        component: () => import('@/views/Endpoints/EditItem')
                    },
                    {
                        path: '',
                        name: 'endpointsList',
                        meta: {
                            hiddenInMenu: true
                        },
                        component: () => import('@/views/Endpoints/Index')
                    }
                ]
            },
            {
                path: '/registries',
                name: "registries",
                component: Blank,
                meta: {
                    title: 'registries'
                },
                children: [
                    {
                        path: '',
                        name: 'registriesMain',
                        meta: {
                            hiddenInMenu: true
                        },
                        component: () => import('@/views/Registries/Index')
                    }
                ]
            },
            {
                path: '/settings',
                component: Blank,
                meta: {
                    title: "settings"
                },
                children: [
                    {
                        path: '',
                        name: 'settingsList',
                        meta: {
                            hiddenInMenu: true
                        },
                        component: () => import('@/views/Settings/Index')
                    }
                ]
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

