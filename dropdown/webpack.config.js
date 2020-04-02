const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = (env, argv) => ({
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

  devtool: argv.mode === 'production' ? 'source-map' : 'eval',

  devServer: {
    contentBase: './dist',
    overlay: true,
    // lazy: true,
    open: true,
  }
});
