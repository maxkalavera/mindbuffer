import { app } from 'electron'
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';

import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

rules.push({
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
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    plugins: [
      new TsconfigPathsPlugin()
    ]
  },
};
