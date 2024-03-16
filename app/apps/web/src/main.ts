import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import '@/plugins/toastification';
import '@/plugins/fontawesome';
import '@/theme/default.sass';
import '@/theme/style.sass';
import '@mdi/font/css/materialdesignicons.css';
import moment from 'vue-moment';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import VueSplash from 'vue-splash';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import VueProgressBar from 'vue-progressbar';
import VueCookies from 'vue-cookies';

Vue.use(VueSplash);
Vue.use(VueCookies);

const options = {
  color: '#e5e5e5',
  failedColor: '#874b4b',
  thickness: '5px',
  transition: {
    speed: '1.2s',
    opacity: '0.6s',
    termination: 800,
  },
  autoRevert: true,
  location: 'top',
  inverse: false,
};

Vue.use(VueProgressBar, options);

Vue.config.productionTip = false;

Vue.use(moment);

const app = new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
});

Vue.prototype.t = (key: string, ...params: never) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  return app.$vuetify.lang.translator(key, ...params);
};

app.$mount('#app');
