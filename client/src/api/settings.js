import request from "@/utils/request"

export function updateSettings(data) {
    return request({
        method: 'put',
        url: '/settings',
        data
    })
}

export function updateAuthSettings(data) {
    return request({
        method: 'put',
        url: '/settings/auth',
        data
    })
}

export function fetchPublicSettings() {
    return request({
        url: '/settings/public'
    })
}

export function fetchSettings() {
    return request({
        url: '/settings'
    })
}