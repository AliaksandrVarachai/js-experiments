console.log('Mocha config file is read.');

module.exports = {
  diff: true,
  recursive: './src/*.test.js',
  reporter: 'spec',
  ui: 'bdd',
};
