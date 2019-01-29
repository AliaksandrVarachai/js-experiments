const path = require('path');


module.exports = function(env, arv) {
  const libraryOutput = {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'lib-square'),
    library: 'Square',
    libraryTarget: 'umd'
  };

  const defaultOutput = {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist-square'),
  };


  return {
    entry: './index-square.js',
    output: env && env.isLibrary ? libraryOutput : defaultOutput,
    devtool: false
  }
};
