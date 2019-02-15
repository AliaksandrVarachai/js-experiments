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
              modules: false
            }
          }, {
            loader: 'postcss-loader',
            options: {
              syntax: 'postcss-scss',
              ident: 'postcss', // any unique string for webpack require
              plugins: [
                require('postcss-css-variables'),
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
      }
    ]
  },

  plugins: [
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: './src/index.html',
    // })
  ],

  devServer: {
    publicPath: '/',  // default
    port: 8080,  // default
    contentBase: dist
  }
};
