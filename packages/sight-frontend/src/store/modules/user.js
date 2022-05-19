import {getUser} from '@/api/api'
import {getToken, removeToken} from '@/utils/auth'

const state = {
    token: getToken(),
    refresh_token: '',
    isLogged: false,
    user: {
        id: "",
        username: "",
        avatar: "",
        discriminator: "",
        email: "",
        language: "",
        permission: 0
    }
}

const mutations = {
    SET_USER: (state, data) => {
        state.isLogged = true;
        state.user = data
    }
}

const actions = {
    setLang({commit}, lang) {

        commit('SET_LANG', lang)
    },
    load({commit}) {
        commit('SET_LOADED', true)
    },
    logout({commit}) {
        return new Promise((resolve) => {
            commit('SET_USER', {})
            removeToken()
            resolve()
        })
    },
    // get user info
    getInfo({commit}) {
        return new Promise((resolve, reject) => {
            getUser().then(user => {
                commit('SET_USER', user)
                resolve(user)
            }).catch(error => {
                console.log(error)
                reject(error)
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
