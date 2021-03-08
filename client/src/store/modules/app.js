import {fetchEndpoint} from "@/api/endpoints/api";

const state = {
    endpoint: {}
}

const mutations = {
    SET_ENDPOINT: (state, data) => {
        state.endpoint = data
    }
}

const actions = {
    getEndpoint({commit}, id) {
        fetchEndpoint(id).then((data) => {
            commit('SET_ENDPOINT', data)
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
