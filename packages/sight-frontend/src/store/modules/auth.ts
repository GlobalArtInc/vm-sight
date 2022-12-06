import { AuthState, User } from '@sight-types/interfaces/auth';
import { ActionTree, GetterTree, Module, MutationTree } from 'vuex';
import { RootState } from '@/types';

const state: AuthState = {
  isLogged: false,
  user: null
};

export const getters: GetterTree<AuthState, RootState> = {
  user: (state: AuthState) => {
    return state.user;
  }
};

const mutations: MutationTree<AuthState> = {
  setUser (state: AuthState, user: User) {
    state.user = user;
  }
};

export const actions: ActionTree<AuthState, RootState> = {
  getInfo ({ commit }, user: User) {
    commit('setUser', user);
  },
  logout ({ commit }) {
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
