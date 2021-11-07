import {fetchEndpoint} from "@/api/endpoints/api";
import {fetchPublicSettings} from "../../api/settings";

const state = {
    loaded: false,
    endpoint: false,
    settings: {}
}

const mutations = {
    SET_LOADED: (state, data) => {
        state.loaded = data
    },
    SET_SETTINGS: (state, data) => {
        state.settings = data
    },
    SET_ENDPOINT: (state, data) => {
        state.endpoint = data
    }
}

const actions = {
    setLoaded({commit}) {
        commit('SET_LOADED', true)
    },
    getPublicSettings({commit}) {
        fetchPublicSettings().then((data) => {
            commit('SET_SETTINGS', data)
        })
    },
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
