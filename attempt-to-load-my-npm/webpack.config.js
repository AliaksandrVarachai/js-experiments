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
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'resources'),
          path.resolve(__dirname, 'node_modules/react-button-test-publish-to-npmjs')
        ],
        use: ['babel-loader']
      },
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({template: 'resources/index.html'})
  ],

  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    port: 8080,
  }
};
