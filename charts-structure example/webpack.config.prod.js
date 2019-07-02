const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common');

const src = path.resolve(__dirname, process.env.SRC_PATH);
const dist = path.resolve(__dirname, process.env.PROD_DIST_PATH);


module.exports = merge(common, {
  mode: 'production',
  entry: {
    'AdvancedBoxPlot': path.resolve(src, 'AdvancedBoxPlot'),
  },
  output: {
    path: dist,
  },
  plugins: [],
  devtool: 'cheap-module-source-map',
});
