import { ActionTree, GetterTree, Module, MutationTree } from 'vuex';
import { RootState } from '@/types';
import { Endpoint } from '@sight-types';
import { AppState } from '@sight-types/interfaces/app';

const state: AppState = {
  currentEndpoint: null
};

export const getters: GetterTree<AppState, RootState> = {
  currentEndpoint: (state: AppState) => {
    return state.currentEndpoint;
  }
};

const mutations: MutationTree<AppState> = {
  setEndpoint (state: AppState, endpoint: Endpoint) {
    state.currentEndpoint = endpoint;
  }
};

export const actions: ActionTree<AppState, RootState> = {
  setCurrentEndpoint ({ commit }, endpoint: Endpoint) {
    commit('setEndpoint', endpoint);
  }
};

export const app: Module<AppState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
