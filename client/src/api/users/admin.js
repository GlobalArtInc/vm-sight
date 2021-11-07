import request from "@/utils/request"

export function check() {
    return request({
        url: '/users/admin/check'
    })
}

export function init(username, password) {
    return request({
        url: '/users/admin/init',
        method: 'post',
        data: {Username: username, Password: password}
    })
}