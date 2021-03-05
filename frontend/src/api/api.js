import request from "@/utils/request"

export function getUser() {
    return request({
        url: '/me'
    })
}

export function motd() {
    return request({
        url: '/motd'
    })
}