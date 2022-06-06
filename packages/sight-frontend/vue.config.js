// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  // configureWebpack: {
  //   resolve: {
  //     alias: {
  //       '@sight-types': path.resolve(__dirname, '../sight-types')
  //     }
  //   }
  // },
  outputDir: path.resolve(__dirname, '../../dist/client'),
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:3700',
        changeOrigin: true
      }
    }
  }
};
