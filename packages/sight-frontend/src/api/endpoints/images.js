import request from "@/utils/request";

export function fetchImages(endpoint_id) {
    return request({
        url: `/endpoints/${endpoint_id}/docker/images`,
    })
}

export function getImageById(endpointId, imageId) {
    return request({
        url: `/endpoints/${endpointId}/docker/images/${imageId}`,
    })
}

export function getImageHistory(endpointId, imageId) {
    return request({
        url: `/endpoints/${endpointId}/docker/images/${imageId}/history`,
    })
}

export function removeImage(endpointId, imageId) {
    return request({
        method: "DELETE",
        url: `/endpoints/${endpointId}/docker/images/${imageId}`,
    })
}

export function exportImages(endpointId, image) {
    return request({
        method: "GET",
        url: `/endpoints/${endpointId}/docker/images/get?names=${image}`,
    })
}