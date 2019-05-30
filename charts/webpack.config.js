const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'dist');


module.exports = {
  entry: {
    'build': path.resolve(src, 'script')
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
      title: 'Charts'
    })
  ],
  // externals: {
  //   chart: 'chart.js'
  // },
  devtool: process.env.mode === 'development' ? 'source-map' : false,
  devServer: {
    port: 9090,
    contentBase: dist
  }
};
