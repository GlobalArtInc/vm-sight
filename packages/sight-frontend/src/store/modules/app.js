import {fetchEndpoint} from "@/api/endpoints/api";
import {fetchPublicSettings} from "../../api/settings";

const state = {
    loaded: false,
    endpoint: false,
    sidebar: false,
    settings: {}
}

const mutations = {
    SET_SIDEBAR: (state, data) => {
      state.sidebar = data;
    },
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
    sidebar({commit}) {
        console.log(1)
        commit('SET_SIDEBAR', false)
        commit('SET_SIDEBAR', true)
    },
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
                commit('SET_ENDPOINT', false)
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
