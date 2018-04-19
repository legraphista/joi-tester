const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const postcssImport = require('postcss-import');

const extractSass = new ExtractTextPlugin({
  filename: "[name].css"
});
const extractGithubCss = new ExtractTextPlugin({
  filename: "gh.css"
});

const isProd = (
  parseInt(process.env.PROD) === 1 ||
  process.argv.some(x => /^(--)?p(rod(uction)?)?$/.test(x)) ||
  /^(--)?p(rod(uction)?)?$/.test(process.env.NODE_ENV)
);
isProd && console.log('Compiling for production');

if (isProd) {
  console.log('Converting docs');
  require('child_process').execSync('node convert-docs.js');
}

const babelLoaderUseOptions = [{
  loader: 'babel-loader',
  options: {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          browsers: ["last 2 versions"]
        }
      ],
    ],
    plugins: [
      ["@babel/transform-runtime", {
        "helpers": false,
        "polyfill": true,
        "regenerator": true,
        "moduleName": "@babel/runtime"
      }]
    ]
  }
}];

module.exports = {
  entry: [
    './src/js/main.js',
    './src/css/main.scss',
    './src/css/github-markdown.css'
  ],

  output: {
    path: `${__dirname}/lib/`,
    filename: '[name].js'
  },

  target: 'web',
  devtool: isProd ? undefined : 'source-map',

  plugins: [
    extractSass,
    extractGithubCss
  ],
  module: {
    rules: [
      {
        // need to babelify joi, isemail, hoek, and topo's lib
        test: /[\\\/]node_modules[\\\/](joi[\\\/]lib[\\\/]|isemail[\\\/]lib[\\\/]|hoek[\\\/]lib[\\\/]|topo[\\\/]lib[\\\/])/,
        use: babelLoaderUseOptions
      },
      {
        test: /\.jsx?$/,
        use: babelLoaderUseOptions,

        exclude: [
          path.resolve(__dirname, 'node_modules')
        ]
      },
      {
        test: /github-markdown\.css$/,
        loaders: extractGithubCss.extract({
          use: [
            {
              loader: "css-loader",
            }
          ]
        })
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
                  require('autoprefixer')({ browsers: ['last 2 versions'] }),
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
  node: {
    global: true,
    Buffer: true,
    crypto: 'empty',
    net: 'empty',
    dns: 'empty'
  }
};