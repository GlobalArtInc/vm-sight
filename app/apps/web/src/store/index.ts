import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from '@/types';
import { auth } from '@/store/modules/auth';
import { app } from '@/store/modules/app';

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  modules: {
    auth,
    app,
  },
};

export default new Vuex.Store<RootState>(store);
