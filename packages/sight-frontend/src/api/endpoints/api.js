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
        url: '/endpoints/' + id
    })
}

export function uploadCert(id, data) {
    return request({
        url: `/endpoints/${id}/cert`,
        method: 'POST',
        data
    })
}

export function deleteEndpoint(id) {
    return request({
        url: '/endpoints/' + id,
        method: 'delete'
    })
}

export function createEndpoint(data, tempId) {
    return request({
        url: '/endpoints',

        method: 'POST',
        data: {data, tempId}
    })
}

export function updateEndpoint(id, data) {
    return request({
        url: '/endpoints/' + id,
        method: 'PUT',
        data
    })
}

export function listEndpoints() {
    return request({
        url: '/endpoints'
    })
}
