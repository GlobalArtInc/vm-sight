import request from "@/utils/request"

export function motd() {
    return request({
        url: '/motd'
    })
}