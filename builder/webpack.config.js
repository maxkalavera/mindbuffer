const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin'); 
const HTMLWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require('webpack')

module.exports = [
  {
    target: 'electron-main',
    devtool: false,
    entry: path.resolve(__dirname, "./source/main/main.ts"),
    output: {
      filename: "main.js",
      library: {
        name: 'webpack-main',
        type: 'commonjs2',
      },
      path: path.resolve(__dirname, "./.webpack/main")
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                configFile: path.resolve(__dirname, "./tsconfig.json"),
                transpileOnly: true,
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
        new TsconfigPathsPlugin()
      ],
    },
    plugins: [
      new NodePolyfillPlugin(),
      new webpack.DefinePlugin({
        //WEBPACK_PRELOAD_ENTRY: JSON.stringify(path.resolve(__dirname, './.webpack/renderer/preload.js')),
        WEBPACK_HTML_INDEX_ENTRY: JSON.stringify(path.resolve(__dirname, './.webpack/renderer/index.html')),
      })
    ],
    watchOptions: {
      aggregateTimeout: 200,
      poll: 1000,
      ignored: /node_modules/
    }
  },
  {
    target: 'electron-renderer',
    devtool: false,
    entry: path.resolve(__dirname, "./source/renderer/renderer.ts"),
    output: {
      filename: "renderer.js",
      path: path.resolve(__dirname, "./.webpack/renderer/")
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                configFile: path.resolve(__dirname, "./tsconfig.json")
              }
            }
          ],
          exclude: /node_modules/
        },
      ]
    },
    plugins: [
      new HTMLWebpackPlugin({
        filename: 'index.html',
        inject: "body",
        template: path.resolve(__dirname, "./source/renderer/assets/index.html")
      })
    ],
    watchOptions: {
      aggregateTimeout: 200,
      poll: 1000,
      ignored: /node_modules/
    }
  }
];