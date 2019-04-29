const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'dist');

module.exports = {
  entry: path.resolve(src, 'index'),
  output: {
    filename: 'bundle.js',
    path: dist
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        include: [src, path.resolve(__dirname, 'node_modules/draft-js-image-plugin/lib/plugin.css')],
        use: ['style-loader', 'css-loader']
      }, {
        test: /\.js$/,
        include: src,
        use: ['babel-loader']
      }
    ]
  },

  devtool: 'eval',

  plugins: [
    new HTMLWebpackPlugin({
      filename: path.resolve(dist, 'index.html'),
      template: path.resolve(src, 'index.html')
    })
  ],


  devServer: {
    publicPath: '/',
    port: 8080
  }
};
