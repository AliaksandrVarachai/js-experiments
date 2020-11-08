const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const srcPath = path.join(__dirname, 'src');
const distPath = path.join(__dirname, 'dist');

function webpackConfig(env, argv) {
  return {
    entry: './src/index.js',
    output: {
      path: distPath,
      filename: '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          include: srcPath,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({template: './src/index.html'})
    ],
    devServer: {
      port: 3000,
      contentBase: path.join(__dirname, 'dist')
    }
  };
}



module.exports = webpackConfig;
