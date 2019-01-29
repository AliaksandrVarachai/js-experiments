const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },

  devtool: 'eval',

  module: {
    rules: [{
      type: 'javascript/auto',
      test: /\.json$/,
      include: path.resolve(__dirname, 'src'),
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      }]
    }]
  },

  plugins: [
    new HtmlWebpackPlugin()
  ],

  devServer: {
    port: 8080,
  }
};
