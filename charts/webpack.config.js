const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'dist');


module.exports = {
  entry: {
    'build': path.resolve(src, 'script'),
    'three': path.resolve(src, 'three')
  },
  output: {
    path: dist,
    filename: '[name].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        include: src,
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(src, 'index.html'),
      inject: false
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(src, 'three.html'),
      inject: false,
      filename: 'three.html'
    }),
  ],
  externals: {
    //Chart: 'chart.js',
    moment: 'moment',  // time functionality is not needed
  },
  devtool: process.env.mode === 'development' ? 'source-map' : false,
  devServer: {
    port: 9090,
    contentBase: dist
  }
};
