import request from "@/utils/request";

export function getEndpoints() {
    return request({
        url: '/endpoints'
    })
}