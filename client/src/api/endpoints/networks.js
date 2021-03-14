import request from "@/utils/request";

export function fetchNetwork(endpoint_id, hash) {
    return request({
        url: `/endpoints/${endpoint_id}/docker/networks/${hash}`,
    })
}

export function disconnectNetwork(endpoint_id, hash, container) {
    return request({
        url: `/endpoints/${endpoint_id}/docker/networks/${hash}/disconnect`,
        method: "POST",
        data: {
            Container: container,
            Force: true
        }
    })
}

export function fetchNetworks(endpoint_id) {
    return request({
        url: `/endpoints/${endpoint_id}/docker/networks`,
    })
}
