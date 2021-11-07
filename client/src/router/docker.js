import Layout from '@/layouts/Layout'

export const routes = {
    path: '/:hash/docker',
    component: Layout,
    children: [
        {
            path: 'dashboard',
            component: () => import('@/views/docker/Dashboard/Index')
        }
    ]
}

export default routes;