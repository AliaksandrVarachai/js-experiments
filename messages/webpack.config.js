const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'dist');

module.exports = {
  entry: src,
  output: {
    filename: 'bundle.js',
    publicPath: '/',
    path: dist,
    crossOriginLoading: 'use-credentials'
  },

  module: {
    rules: [
      {
        test: /\.css/,
        include: src,
        use: ['style-loader', 'css-loader']
      }, {
        test: /\.js/,
        include: src,
        use: ['babel-loader']
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(src, 'index.html')
    })
  ],

  devServer: {
    port: 8080,
    contentBase: dist
  }
};
