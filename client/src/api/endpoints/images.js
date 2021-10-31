import request from "@/utils/request";

export function fetchImages(endpoint_id) {
    return request({
        url: `/endpoints/${endpoint_id}/docker/images`,
    })
}
