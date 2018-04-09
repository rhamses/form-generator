const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const nodeEnv = process.env.NODE_ENV || 'production';

const config = {
  entry: {
    main: './src/js/formGen.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    publicPath: '/'
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: {
        loader: 'babel-loader'
      },
      exclude: [/node_modules|bower_components/]
    },{
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader'
      })
    }]
  },
  plugins: [new HtmlWebpackPlugin({
    template: __dirname + '/src/index.html',
    inject: 'body'
  }), new ExtractTextPlugin('main.css')],
  devServer: {
    contentBase: './src/',
    port: 8081
  },
  devtool: 'source-map',
  mode: 'development'
};

module.exports = config;