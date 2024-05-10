const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin'); 
const path = require("path");
const webpack = require('webpack');

const globals = require('./webpack.globals.config.js')

module.exports = {
  target: 'electron-main',
  devtool: false,
  mode: ['development', 'production']
    .find(item => item === process.env.MINDBUFFER_ENVIRONMENT) || 'none',
  entry: path.resolve(__dirname, "./source/main/main.ts"),
  output: {
    filename: "main.js",
    library: {
      name: 'webpack-main',
      type: 'commonjs2',
    },
    path: path.resolve(__dirname, "./.webpack/main"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: path.resolve(__dirname, "./tsconfig.main.json"),
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, "./tsconfig.main.json"),
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