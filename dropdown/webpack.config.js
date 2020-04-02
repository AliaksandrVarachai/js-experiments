const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = function (env, { mode }) {
  return {
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
        }, {
          test: /\.p?css$/,
          include: path.resolve(__dirname, 'src'),
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: mode === 'production'
                    ? '[hash:base64]'
                    : '[name]__[local]__[hash:base64:5]'
                },
                importLoaders: 1,
                sourceMap: mode === 'development'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: mode === 'development'
              }
            }
          ]
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

    devtool: mode === 'production' ? 'source-map' : 'eval',

    devServer: {
      contentBase: './dist',
      overlay: true,
      // lazy: true,
      // open: true,
    }
  };
};
