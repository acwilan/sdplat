const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { codecovWebpackPlugin } = require("@codecov/webpack-plugin");
const webpack = require('webpack');
const gitInfo = require('./gitInfo.json');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: process.env.PUBLIC_URL || '/',
  },
  mode: 'development',
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    codecovWebpackPlugin({
      enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
      bundleName: "sdplat-ui-bundle",
      uploadToken: process.env.CODECOV_TOKEN,
    }),
    new webpack.DefinePlugin({
      'process.env.BRANCH': JSON.stringify(gitInfo.branch),
      'process.env.COMMIT_ID': JSON.stringify(gitInfo.commitId),
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 9001,
    historyApiFallback: true,
  }
};
