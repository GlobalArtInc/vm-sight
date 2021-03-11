import request from "@/utils/request";

export function fetchContainers(endpoint_id) {
    return request({
        url: `/endpoints/${endpoint_id}/docker/containers`,
        method: 'get'
    })
}

export function startContainer(endpoint_id, container) {
    return request({
        url: `/endpoints/${endpoint_id}/docker/containers/${container}/start`,
        method: 'post'
    })
}

export function stopContainer(endpoint_id, container) {
    return request({
        url: `/endpoints/${endpoint_id}/docker/containers/${container}/stop`,
        method: 'post'
    })
}

export function killContainer(endpoint_id, container) {
    return request({
        url: `/endpoints/${endpoint_id}/docker/containers/${container}/kill`,
        method: 'post'
    })
}

export function restartContainer(endpoint_id, container) {
    return request({
        url: `/endpoints/${endpoint_id}/docker/containers/${container}/restart`,
        method: 'post'
    })
}

export function pauseContainer(endpoint_id, container) {
    return request({
        url: `/endpoints/${endpoint_id}/docker/containers/${container}/pause`,
        method: 'post'
    })
}

export function resumeContainer(endpoint_id, container) {
    return request({
        url: `/endpoints/${endpoint_id}/docker/containers/${container}/resume`,
        method: 'post'
    })
}

export function removeContainer(endpoint_id, container) {
    return request({
        url: `/endpoints/${endpoint_id}/docker/containers/${container}/remove`,
        method: 'post'
    })
}

export function fetchContainer(endpoint_id, container) {
    return request({
        url: `/endpoints/${endpoint_id}/docker/containers/${container}`,
        method: 'get'
    })
}
