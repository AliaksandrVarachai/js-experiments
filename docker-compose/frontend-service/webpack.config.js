const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'dist');

module.exports = {
  entry: {
    'index': path.resolve(src, 'index')
  },
  output: {
    path: dist,
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(src, 'index.html'),
      inject: false
    })
  ],
};
