import request from "@/utils/request";

export function fetchEndpoints() {
    return request({
        url: '/endpoints'
    })
}

export function fetchEndpoint(id) {
    return request({
        url: '/endpoints/' + id
    })
}

export function getEndpoint(id) {
    return request({
        url: '/endpoints/list/' + id
    })
}

export function listEndpoints() {
    return request({
        url: '/endpoints/list'
    })
}