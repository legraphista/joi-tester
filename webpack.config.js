const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const postcssImport = require('postcss-import');
const extractSass = new ExtractTextPlugin({
  filename: "[name].css"
});

const isProd = process.env.PROD = 1 || process.argv.some(x => /^(--)?p(rod(uction)?)?$/);
isProd && console.log('Compiling for production');

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
  devtool: isProd ? undefined : 'source-map',

  plugins: [
    extractSass
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
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                sourceMap: !isProd
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: loader => [
                  postcssImport({ addDependencyTo: webpack }),
                  require('postcss-import')({ root: loader.resourcePath }),
                  require('autoprefixer')({ browsers: [ 'last 2 versions' ] }),
                  require('cssnano')()
                ],
                sourceMap: !isProd
              }
            },
            { loader: 'sass-loader', options: { sourceMap: !isProd } }
          ]
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
