const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const dist = path.resolve(__dirname, 'dist');

module.exports = {
  entry: {
    'simple': './index-1',
    'extended': './index-2'
  },
  mode: 'development',
  output: {
    filename: 'calculator.[name].js',
    path: dist,
    library: ['calculator', '[name]'],
    libraryTarget: 'umd'
  },
  plugins: [new CleanWebpackPlugin([dist])],
};
