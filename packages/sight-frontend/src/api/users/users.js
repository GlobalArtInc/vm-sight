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
    Username: "", Password: "", Role: 0
}) {
    return request({
        url: '/users',
        method: 'post',
        data
    })
}

export function updateUser(id, data = {
    Username: "", Password: "", Role: 0
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