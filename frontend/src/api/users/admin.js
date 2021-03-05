import request from "@/utils/request"

export function check() {
    return request({
        url: '/users/admin/check'
    })
}