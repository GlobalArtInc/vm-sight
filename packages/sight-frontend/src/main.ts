import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import Toast from 'vue-toastification';
import './theme/default.sass';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faDocker } from '@fortawesome/free-brands-svg-icons';
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import '@mdi/font/css/materialdesignicons.css';
import 'vue-toastification/dist/index.css';
library.add(faUserSecret);
library.add(faDocker);

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(Toast, {
  transition: 'Vue-Toastification__bounce',
  position: 'top-right',
  maxToasts: 20,
  newestOnTop: true,
  pauseOnFocusLoss: false,
  pauseOnHover: false,
  timeout: 4000
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
