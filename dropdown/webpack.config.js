const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: {
    index: './src/index.js'
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name]-bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, 'src'),
        loader: 'babel-loader'
      }, {
        test: /\.html$/,
        include: path.resolve(__dirname, 'src'),
        loader: 'html-loader'
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ],

  optimization: {},

  devtool: 'inline-source-map',

  devServer: {
    contentBase: './dist'
  }
};
