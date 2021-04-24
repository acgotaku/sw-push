'use strict';
module.exports = {
  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true,
    port: 3300
  },
  pwa: {
    name: 'Service Worker Push Notifications',
    themeColor: '#41b883',
    msTileColor: '#000000',
    manifestOptions: {
      short_name: 'SW-PUSH',
      start_url: '/'
    },
    iconPaths: [],
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: './src/service-worker.js',
      swDest: 'service-worker.js'
    }
  },
  chainWebpack: config => {
    config.optimization.splitChunks({
      chunks: 'all',
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial' // only package third parties that are initially dependent
        },
        commons: {
          name: 'chunk-commons',
          minChunks: 3, //  minimum common number
          priority: 5,
          reuseExistingChunk: true
        }
      }
    });
    // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
    config.optimization.runtimeChunk('single');
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.devtool = 'hidden-source-map';
    }
  }
};
