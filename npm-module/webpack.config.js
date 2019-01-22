const path = require('path');


module.exports = [{
  entry: './index.js',
  mode: 'development',
  output: {
    library: 'myLibCommonjs',
    libraryTarget: 'commonjs2',
    filename: 'main-commonjs2.js',
    path: path.resolve(__dirname, 'dist'),
  },
}, {
  entry: './index.js',
  mode: 'development',
  output: {
    library: 'myLibAmd',
    libraryTarget: 'amd',
    filename: 'main-amd.js',
    path: path.resolve(__dirname, 'dist'),
  },
}, {
  entry: './index.js',
  mode: 'development',
  output: {
    library: 'myLibVar',
    libraryTarget: 'var',
    filename: 'main-var.js',
    path: path.resolve(__dirname, 'dist'),
  },
}, {
  entry: './index.js',
  mode: 'development',
  output: {
    library: 'myLibUmd',
    libraryTarget: 'umd',
    filename: 'main-umd.js',
    path: path.resolve(__dirname, 'dist'),
  },
}];
