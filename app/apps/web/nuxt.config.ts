import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      });
    },
    '@pinia/nuxt',
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  ssr: false,
  css: [
    '~/assets/css/main.css',
    '~/assets/vuetify/main.scss'
  ],

  postcss: {
    plugins: {
      // 'tailwindcss/nesting': {},
      // tailwindcss: {},
      autoprefixer: {},
    },
  },
  pinegrow: {
    liveDesigner: {
      iconPreferredCase: 'unocss', // default value (can be removed), vuetify-nuxt-module uses the unocss format for icon names
      devtoolsKey: 'devtoolsKey', // see plugins/devtools.client.ts
      // tailwindcss: {
      //   /* Please ensure that you update the filenames and paths to accurately match those used in your project. */
      //   configPath: 'tailwind.config.ts',
      //   cssPath: '@/assets/css/tailwind.css',
      //   // themePath: false, // Set to false so that Design Panel is not used
      //   // restartOnConfigUpdate: true,
      //   restartOnThemeUpdate: true,
      // },
      // // vuetify: {
      //   configPath: 'vuetify.config.ts',
      //   utilities: false,
      //   themePath: false, // Set to false so that tailwind Design Panel is used instead of Vuetify
      //   // restartOnConfigUpdate: true,
      //   restartOnThemeUpdate: true,
      // },
      // plugins: [
      //   {
      //     name: 'My Awesome Lib 3.0',
      //     key: 'my-awesome-lib',
      //     pluginPath: fileURLToPath(
      //       new URL('./my-awesome-lib/web-types.json', import.meta.url),
      //     ),
      //   },
      // ],
    },
  },
  devServer: {
    host: '0.0.0.0',
    port: 80,
  },
})
