const path = require('path');
const dist = path.resolve(__dirname, 'dist');
const src = path.resolve(__dirname, 'src');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: dist
  },

  module: {
    rules: [
      {
        test: /\.p?css$/,
        include: src,
        use: [
          {
            loader: 'style-loader'
          }, {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]--[hash:base64:5]' //must be the same as for react-css-modules
            }
          }, {
            loader: 'postcss-loader',
            options: {
              syntax: 'postcss-scss',
              ident: 'postcss', // any unique string for webpack require
              plugins: [
                require('postcss-nested'),
                // {preserve: false} allows to export local css variables in {} or :root{} section with :export selector
                // provided by babel-plugin-react-css-modules.
                // The option replaces variables names with their values then removes :root{} or {} section
                // and does not mud global :root scope.
                // Otherwise we need to use additional modules like postcss-module-values
                require('postcss-css-variables')({preserve: false}),
              ]
            }
          }
        ]
      }, {
        test: /\.html$/,
        include: src,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        ]
      }, {
        test: /\.js$/,
        include: src,
        use: 'babel-loader'
      }
    ]
  },

  plugins: [],

  devServer: {
    publicPath: '/',  // default
    port: 8080,  // default
    contentBase: dist
  }
};
