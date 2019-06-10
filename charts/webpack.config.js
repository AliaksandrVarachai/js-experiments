const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'dist');


module.exports = {
  entry: {
    'charts-comparison': path.resolve(src, 'charts-comparison'),
    'three': path.resolve(src, 'three'),
    'three-normal': path.resolve(src, 'three-normal'),
    'webgl': path.resolve(src, 'webgl'),
    'earth-orbit': path.resolve(src, 'earth-orbit'),
    'twojs': path.resolve(src, 'twojs'),
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
      template: path.resolve(src, 'charts-comparison.html'),
      inject: false,
      filename: 'charts-comparison.html'
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(src, 'three.html'),
      inject: false,
      filename: 'three.html'
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(src, 'three-normal.html'),
      inject: false,
      filename: 'three-normal.html'
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(src, 'webgl.html'),
      inject: false,
      filename: 'webgl.html'
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(src, 'earth-orbit.html'),
      inject: false,
      filename: 'earth-orbit.html'
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(src, 'twojs.html'),
      inject: false,
      filename: 'twojs.html'
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
