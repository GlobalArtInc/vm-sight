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

export function dockerHubUpdate(data){
    return request({
        url: '/dockerhub',
        method: 'post',
        data
    })
}

export function dockerHub() {
    return request({
        url: '/dockerhub'
    })
}
