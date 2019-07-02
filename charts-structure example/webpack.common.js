require('dotenv').config();
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');

const src = path.resolve(__dirname, process.env.SRC_PATH);
const dist = path.resolve(__dirname, 'dist');

module.exports = {
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
      template: path.resolve(src, 'AdvancedBoxPlot.html'),
      inject: false,
      filename: 'AdvancedBoxPlot.html'
    }),
    new HtmlReplaceWebpackPlugin([
      {
        pattern: /<body[^>]*>/g,
        replacement: (match) => {
          console.log('match=', match)
          return match + '\n\n<!-- File is generated by Node.js. Please do not modify it. -->\n';
        }
      }
    ]),
  ],

  externals: {
    moment: 'moment',  // time functionality is not needed
    jquery: 'jQuery',
  },
};
