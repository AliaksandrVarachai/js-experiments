const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './index-square.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },


  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index-template.html',
      favicon: './assets/android.png'
    })
  ],

  devServer: {
    publicPath: '/',  // default
    port: 8080  // default
  }
};
