import request from "@/utils/request";

export function fetchNetwork(endpoint_id, hash) {
    return request({
        url: `/endpoints/${endpoint_id}/docker/networks/${hash}`,
    })
}

// eslint-disable-next-line no-unused-vars
export function connectNetwork(endpoint_id, network, container) {
    return request({
        url: `/endpoints/${endpoint_id}/docker/networks/${network}/connect`,
        method: "POST",
        data: {
            Container: container,
            Force: true
        }
    })
}

export function disconnectNetwork(endpoint_id, network, container) {
    return request({
        url: `/endpoints/${endpoint_id}/docker/networks/${network}/disconnect`,
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
