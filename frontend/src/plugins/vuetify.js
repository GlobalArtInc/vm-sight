import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors'
import en from '@/locale/en'

Vue.use(Vuetify);

export default new Vuetify({
    lang: {
        locales: { en },
        current: 'en'
    },
   // icons: {
   //     iconfont: 'fa4', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
   // },
    theme: {
        options: {
            customProperties: true
        },
        themes: {
            light: {
                primary: "#2196f3",
                secondary: '#424242',
                accent: '#82B1FF',
                error: '#FF5252',
                info: '#2196F3',
                success: '#4CAF50',
                warning: '#FFC107'
            },
            dark: {
                darken: "#0d3250",
                //  primary: "#0d3250", // #E53935
                secondary: colors.red.lighten4, // #FFCDD2
                accent: colors.indigo.base, // #3F51B5
            },
        },
    },
});
