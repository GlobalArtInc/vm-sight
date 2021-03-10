import request from "@/utils/request";

export function fetchContainers(endpoint_id){
    return request({
        url: `/endpoints/${endpoint_id}/docker/containers`,
        method: 'get'
    })
}

