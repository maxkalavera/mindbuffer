const app = require('electron').app
const HTMLWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require('webpack');

const globals = require('./webpack.globals.config.js')

module.exports = {
  target: 'electron-renderer',
  devtool: false,
  mode: JSON.parse(globals.MODE),
  entry: path.resolve(__dirname, "./source/renderer/renderer.tsx"),
  output: {
    filename: "renderer.js",
    path: path.resolve(__dirname, "./.webpack/renderer/"),
    clean: true,
  },
  optimization: {
    nodeEnv: false,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: path.resolve(__dirname, "./tsconfig.renderer.json"),
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          { 
            loader: 'style-loader' 
          }, 
          { 
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: app && app.isPackaged ? '[hash:base64:5]' : '[local]_[hash:base64:5]',
                auto: true,
              }
           }
          }
        ],
      }
    ]
  },
  plugins: [
    new HTMLWebpackPlugin({
      filename: 'index.html',
      inject: "body",
      template: path.resolve(__dirname, "./source/renderer/assets/index.html")
    }),
    new webpack.DefinePlugin({
      ...globals,
    })
  ],
  watchOptions: {
    aggregateTimeout: 200,
    poll: 1000,
    ignored: /node_modules/
  }
}