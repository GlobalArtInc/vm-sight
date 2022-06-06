// const path = require('path');

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
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:3700',
        changeOrigin: true
      }
    }
  }
};
