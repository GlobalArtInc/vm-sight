import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors'
import en from '@/locale/en.js'
import enVuetify from 'vuetify/es5/locale/en'

import ru from '@/locale/ru.js'
import ruVuetify from 'vuetify/es5/locale/ru'

import uk from '@/locale/uk.js'
import ukVuetify from 'vuetify/es5/locale/uk'
import '@fortawesome/fontawesome-free/css/all.css'
import 'vuetify/es5/locale/en'
Vue.use(Vuetify);

export default new Vuetify({
    lang: {
        locales: {
            en: {...en, ...enVuetify},
            ru: {...ru, ...ruVuetify},
            uk: {...uk, ...ukVuetify}
        },
        current: 'en'
    },
    icons: {
        iconfont: 'mdiSvg', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
    },
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
