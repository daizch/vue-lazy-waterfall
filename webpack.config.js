var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: './src/vue-lazy-waterfall/index.vue',
  output: {
    path: path.resolve('dist/vue-lazy-waterfall'),
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'vueLazyWaterfall',
    libraryExport: "default",
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
};
