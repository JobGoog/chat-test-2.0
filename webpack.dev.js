const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    open: true,
    compress: true,
    port: 3000,
    allowedHosts: ['chat-test-2-0.onrender.com'],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
});
