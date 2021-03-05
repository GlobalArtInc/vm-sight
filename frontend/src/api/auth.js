import request from "@/utils/request"

export function auth(username, password) {
    return request({
        url: '/auth',
        method: 'post',
        data: {Username: username, Password: password}
    })
}