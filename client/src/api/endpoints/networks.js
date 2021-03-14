import request from "@/utils/request";

export function fetchNetworks(endpoint_id) {
    return request({
        url: `/endpoints/${endpoint_id}/docker/networks`,
    })
}
