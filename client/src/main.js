import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import store from './store'
import './permission'
import './theme/style.sass'
import './theme/default.sass'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faDocker } from '@fortawesome/free-brands-svg-icons'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import '@mdi/font/css/materialdesignicons.css'
library.add(faUserSecret)
library.add(faDocker)

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

