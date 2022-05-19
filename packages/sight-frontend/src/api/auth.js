import request from "@/utils/request"

export function oauth(code) {
    return request({
        url: '/auth',
        method: 'post',
        data: {Code: code}
    })
}

export function auth(username, password) {
    return request({
        url: '/auth',
        method: 'post',
        data: {Username: username, Password: password}
    })
}