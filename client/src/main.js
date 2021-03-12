import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import store from './store'
import './permission'
import './theme/style.sass'
import './theme/default.sass'

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import { library } from '@fortawesome/fontawesome-svg-core'
import { faDocker } from '@fortawesome/free-brands-svg-icons'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import '@mdi/font/css/materialdesignicons.css'
library.add(faUserSecret)
library.add(faDocker)

Vue.use(require('vue-moment'));
Vue.use(Toast, {
  transition: "Vue-Toastification__bounce",
  position: "top-right",
  maxToasts: 20,
  newestOnTop: true,
  pauseOnFocusLoss: false,
  pauseOnHover: false,
  timeout: 2000
});

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

const app = new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
})

Vue.prototype.__ = (key, ...parrams) => {
  return app.$vuetify.lang.translator(key, ...parrams)
}

app.$mount('#app')

