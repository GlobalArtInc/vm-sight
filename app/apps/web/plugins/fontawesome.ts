// import this after install `@mdi/font` package
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faDocker } from '@fortawesome/free-brands-svg-icons';
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

export default defineNuxtPlugin((app) => {
  library.add(faUserSecret);
  library.add(faDocker);
  app.vueApp.component('font-awesome-icon', FontAwesomeIcon);
});
