import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import colors from 'vuetify/lib/util/colors';
import '@fortawesome/fontawesome-free/css/all.css';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import en from '@/locales/en.js';

Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    locales: { en },
    current: 'en',
  },
  icons: {
    iconfont: 'mdiSvg',
  },
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#2196f3',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
      },
      dark: {
        darken: '#0d3250',
        //  primary: "#0d3250", // #E53935
        secondary: colors.red.lighten4, // #FFCDD2
        accent: colors.indigo.base, // #3F51B5
      },
    },
  },
});
