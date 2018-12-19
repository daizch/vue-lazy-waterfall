var path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  mode: 'production',
  entry: './src/vue-lazy-waterfall/index.vue',
  output: {
    path: path.resolve('dist/vue-lazy-waterfall'),
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'vueLazyWaterfall',
    libraryExport: "default",
    umdNamedDefine: true
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
        loader: 'vue-loader',
        options: {
          preserveWhitespace: false
        }
      },
      {
        test: /\.js/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'less-loader',
          // 'postcss-loader',
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
