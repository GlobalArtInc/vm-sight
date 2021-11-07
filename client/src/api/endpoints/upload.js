import request from "@/utils/request";

export function uploadCA(id, data) {

    return request({
        url: '/upload/tls/ca?folder=' + id,
        headers: {
            'content-Type': "multipart/form-data"
        },
        data: data,
        method: 'post'
    })
}

export function uploadCert(id, data) {

    return request({
        url: '/upload/tls/cert?folder=' + id,
        headers: {
            'content-Type': "multipart/form-data"
        },
        data: data,
        method: 'post'
    })
}

export function uploadKey(id, data) {

    return request({
        url: '/upload/tls/key?folder=' + id,
        headers: {
            'content-Type': "multipart/form-data"
        },
        data: data,
        method: 'post'
    })
}
