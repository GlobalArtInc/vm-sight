import Vue from 'vue';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

Vue.use(Toast, {
  transition: 'Vue-Toastification__bounce',
  position: 'top-right',
  maxToasts: 20,
  newestOnTop: true,
  pauseOnFocusLoss: false,
  pauseOnHover: false,
  timeout: 4000,
});

export default Vue;
