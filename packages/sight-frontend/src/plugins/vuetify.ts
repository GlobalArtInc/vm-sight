import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import en from '@/locales/en.js';

Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    locales: { en },
    current: 'en'
  }
});
