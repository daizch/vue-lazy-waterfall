var path = require('path')
const {VueLoaderPlugin} = require('vue-loader')

module.exports = {
  mode: 'production',
  entry: './src/vue-lazy-waterfall/index.vue',
  output: {
    path: path.resolve('dist/vue-lazy-waterfall'),
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'vueLazyWaterfall',
    libraryExport: "default",
  },
  optimization: {
    splitChunks: {
      // include all types of chunks
      chunks: 'all'
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: ['vue-loader', 'vue-style-loader'],
      },
      {
        test: /\.less$/,
        use: [
          'vue-style-loader',
          'postcss-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),// copy custom static assets
  ]
};
