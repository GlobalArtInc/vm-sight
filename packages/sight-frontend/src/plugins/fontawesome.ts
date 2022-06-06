import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faDocker } from '@fortawesome/free-brands-svg-icons';
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
library.add(faUserSecret);
library.add(faDocker);
Vue.component('font-awesome-icon', FontAwesomeIcon);
