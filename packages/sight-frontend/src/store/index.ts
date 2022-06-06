import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from '@/types';
import { auth } from '@/store/modules/auth';

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  modules: {
    auth
  }
};

export default new Vuex.Store<RootState>(store);
