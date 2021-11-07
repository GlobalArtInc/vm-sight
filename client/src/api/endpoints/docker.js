import request from "@/utils/request";

export function fetchContainers(endpoint_id) {
    return request({
        url: `/endpoints/${endpoint_id}/docker/containers`,
        method: 'get'
    })
}

export function updateContainer(endpoint_id, container, data) {
    return request({
        url: `/endpoints/${endpoint_id}/docker/containers/${container}/update`,
        method: 'post',
        data
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

export function removeContainer(endpointId, containerId) {
    return request({
        url: `/endpoints/${endpointId}/docker/containers/${containerId}`,
        method: 'delete'
    })
}

export function renameContainer(endpointId, containerId, name) {
    return request({
        url: `/endpoints/${endpointId}/docker/containers/${containerId}/rename?name=${name}`,
        method: 'post'
    })
}

export function createContainer(endpointId, data) {
    return request({
        url: `/endpoints/${endpointId}/docker/containers/create`,
        method: 'post',
        data
    })
}

const createUrl = (obj) => {
    var str = "";
    for (var key in obj) {
        if (str != "") {
            str += "&";
        }
        str += key + "=" + encodeURIComponent(obj[key]);
    }
    return str
}

export function fetchLogsContainer(endpointId, container, options) {
    return request({
        url: `/endpoints/${endpointId}/docker/containers/${container}/logs?${createUrl(options)}`,
        method: 'get'
    })
}


export function fetchContainer(endpoint_id, container) {
    return request({
        url: `/endpoints/${endpoint_id}/docker/containers/${container}`,
        method: 'get'
    })
}

export function startExec(endpoint_id, container, data) {
    return request({
        url: `/endpoints/${endpoint_id}/docker/containers/${container}/exec`,
        method: 'post',
        data
    })
}
