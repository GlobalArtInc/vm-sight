import request from "@/utils/request";

export function fetchUsers() {
    return request({
        url: '/users'
    })
}

export function fetchUser(id) {
    return request({
        url: '/users/' + id
    })
}

export function createUser(data = {
    username: "", password: "", role: 0
}) {
    return request({
        url: '/users',
        method: 'post',
        data
    })
}

export function updateUser(id, data = {
    username: "", password: "", role: 0
}) {
    return request({
        url: '/users/' + id,
        method: 'put',
        data
    })
}

export function deleteUser(id) {
    return request({
        url: '/users/' + id,
        method: 'delete'
    })
}
