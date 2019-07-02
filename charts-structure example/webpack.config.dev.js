const merge = require('webpack-merge');
const path = require('path');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const common = require('./webpack.common');

const src = path.resolve(__dirname, process.env.SRC_PATH);
const dist = path.resolve(__dirname, process.env.DEV_DIST_PATH);


module.exports = merge(common, {
  mode: 'development',
  entry: {
    'AdvancedBoxPlot': path.resolve(src, 'AdvancedBoxPlot'),
  },
  output: {
    path: dist,
  },
  plugins: [
    new HtmlReplaceWebpackPlugin([
      {
        pattern: /<script[^>]+src="([^"]+)"[^>]*>\s*<\/script>/g,
        replacement: (match, $1) => match.replace($1, `http://localhost:${process.env.WEBSERVER_PORT}/${$1}`)
      }
    ]),
  ],
  devtool: 'cheap-module-eval-source-map',//'eval', //'cheap-source-map',
  devServer: {
    port: process.env.WEBSERVER_PORT,
    contentBase: dist,
    // allowedHosts: ['localhost:8000'],
    // All HTML files are written to Spotfire's webroot directory, JS files are requested via localhost:WEBSERVER_PORT
    writeToDisk: (filePath) => /\.html$/.test(filePath),
  }
});
