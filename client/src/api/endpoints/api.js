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

export function uploadCert(id, data) {
    return request({
        url: `/endpoints/list/${id}/cert`,
        method: 'POST',
        data
    })
}

export function deleteEndpoint(id) {
    return request({
        url: '/endpoints/list/' + id,
        method: 'delete'
    })
}

export function createEndpoint(data) {
    return request({
        url: '/endpoints/list',
        method: 'POST',
        data
    })
}

export function updateEndpoint(id, data) {
    return request({
        url: '/endpoints/list/' + id,
        method: 'PUT',
        data
    })
}

export function listEndpoints() {
    return request({
        url: '/endpoints/list'
    })
}
