const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    app: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'main.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    // index.html =>
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/index.html' },
        { from: /./, to: '404.html' },
      ]
    },
    // before: (app, server) => {
    //   app.get('*', (req, res) => {
    //     console.log('***********')
    //     res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    //   })
    // },
    // historyApiFallback: {
    //   index: 'index.html'
    // },
    port: 9009,
  }
}