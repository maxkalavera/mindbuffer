const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin'); 
const path = require("path");
const webpack = require('webpack');

const globals = require('./webpack.globals.config.js')

module.exports = {
  target: 'electron-preload',
  mode: ['development', 'production']
    .find(item => item === process.env.MINDBUFFER_ENVIRONMENT) || 'none',
  entry: path.resolve(__dirname, "./source/main/preload.ts"),
  output: {
    filename: "preload.js",
    library: {
      name: 'webpack-preload',
      type: 'commonjs2',
    },
    path: path.resolve(__dirname, "./.webpack"),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: path.resolve(__dirname, "./tsconfig.preload.json"),
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, "./tsconfig.preload.json"),
      })
    ],
  },
  plugins: [
    new NodePolyfillPlugin(),
    new webpack.DefinePlugin({
      ...globals,
    })
  ],
}