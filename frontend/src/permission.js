import router from "./router"

// eslint-disable-next-line no-unused-vars
const {getToken} = require('@/utils/auth')

// eslint-disable-next-line no-unused-vars
const whiteList = ['/auth/init']

router.beforeEach(async (to, from, next) => {
    if (whiteList.indexOf(to.path) !== -1) {
        next()
    } else {
        if (getToken()) {
            console.log(2)
        } else {
            if (to.path !== '/auth')
                next('/auth')
            else next()
        }
    }
})