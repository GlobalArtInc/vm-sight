import router from "./router"

// eslint-disable-next-line no-unused-vars
const {getToken} = require('@/utils/auth')

// eslint-disable-next-line no-unused-vars
const whiteList = ['/init/admin', '/init/endpoint']

router.beforeEach(async (to, from, next) => {
    if (whiteList.indexOf(to.path) !== -1) {
        next()
    } else {
        if (getToken()) {
            if (to.path === '/') next('/home')
            if (whiteList.includes(to.path) !== -1) {
                next()
            } else {
                next('/home')
            }
            next();
        } else {
            if (to.path !== '/auth')
                next('/auth')
            else next()
        }
    }
})