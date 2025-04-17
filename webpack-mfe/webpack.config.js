const { ModuleFederationPlugin } = require('webpack').container;


module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        bff: 'app1@http://localhost:3001/remoteEntry.js',
      },
    }),
  ],
};