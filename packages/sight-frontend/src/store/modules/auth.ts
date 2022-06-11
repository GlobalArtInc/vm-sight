import { AuthState, User } from '@/interfaces/auth.interface';
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex';
import { RootState } from '@/types';
import { getToken } from '@/utils/auth';

const state: AuthState = {
  token: null,
  isLogged: false,
  user: null
};

export const getters: GetterTree<AuthState, RootState> = {
  user: (state: AuthState) => {
    return state.user;
  }
};

const mutations: MutationTree<AuthState> = {
  setToken (state: AuthState, token: string | null) {
    state.token = token;
  },
  setUser (state: AuthState, user: User) {
    state.user = user;
  }
};

export const actions: ActionTree<AuthState, RootState> = {
  getInfo ({ commit }, user: User) {
    commit('setToken', getToken());
    commit('setUser', user);
  },
  logout ({ commit }) {
    commit('setToken', null);
    commit('setUser', null);
  }
};

export const auth: Module<AuthState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
