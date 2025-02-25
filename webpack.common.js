const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      { test: /\.css$/, 
        use: ['style-loader', 'css-loader'] },

      { test: /\.js$/, 
        exclude: /node_modules/, 
        use: 'babel-loader' },

      { test: /\.(png|jpe?g|gif|svg)$/, 
        use: 'file-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'body'
    })
  ]
};
