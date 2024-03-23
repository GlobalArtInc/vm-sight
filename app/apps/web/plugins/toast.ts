// import this after install `@mdi/font` package
import 'vue-toastification/dist/index.css';
import Toast from 'vue-toastification';

export default defineNuxtPlugin((app) => {
  app.vueApp.use(Toast);
});
