const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
  filename: "[name].[contenthash].css",
  disable: process.env.NODE_ENV === "development"
});

module.exports = {
  entry: [
    './src/js/main.js',
    './src/css/main.scss'
  ],

  output: {
    path: `${__dirname}/lib/`,
    filename: '[name].js'
  },

  target: 'web',
  devtool: 'eval-source-map',

  plugins: [
    new ExtractTextPlugin("[name].css")
  ],
  module: {
    rules: [
      {
        use: [ {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  modules: false,
                  browsers: [ "last 2 versions" ]
                }
              ],
            ],
            plugins: [
              [ "@babel/transform-runtime", {
                "helpers": false,
                "polyfill": true,
                "regenerator": true,
                "moduleName": "@babel/runtime"
              } ]
            ]
          }
        } ],
        test: /\.jsx?$/,

        exclude: [
          path.resolve(__dirname, 'node_modules')
        ]
      },
      {
        test: /\.scss$/,
        loader: extractSass.extract({
          use: [{
            loader: "css-loader"
          }, {
            loader: "sass-loader"
          }],
          // use style-loader in development
          fallback: "style-loader"
        })
      }
    ]
  },
  resolve: {
    // you can now require('file') instead of require('file.coffee')
    extensions: [ '.js', '.jsx' ],
    enforceExtension: false,
    alias: {
      joi: 'joi-browser'
    }
  }
};
