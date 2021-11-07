import request from "@/utils/request"

export function updateSettings(data) {
    return request({
        method: 'put',
        url: '/settings',
        data
    })
}

export function getSettings() {
    return request({
        url: '/settings'
    })
}