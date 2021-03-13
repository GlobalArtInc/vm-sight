import {fetchEndpoint} from "@/api/endpoints/api";

const state = {
    endpoint: false
}

const mutations = {
    SET_ENDPOINT: (state, data) => {
        state.endpoint = data
    }
}

const actions = {
    getEndpoint({commit}, id) {
        return new Promise((resolve, reject) => {
            fetchEndpoint(id).then((data) => {
                commit('SET_ENDPOINT', data)
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
