import request from "@/utils/request"

export function updateSettings(data) {
    return request({
        method: 'put',
        url: '/settings',
        data
    })
}

export function fetchSettings() {
    return request({
        url: '/settings'
    })
}