// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const relocateLoader = require('@vercel/webpack-asset-relocator-loader');
import webpack from 'webpack';

import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

export const plugins: any[] = [
  new ForkTsCheckerWebpackPlugin({
    logger: 'webpack-infrastructure',
  }),
  {
    apply(compiler: any) {
      compiler.hooks.compilation.tap('webpack-asset-relocator-loader', (compilation: any) => {
        relocateLoader.initAssetCache(compilation, 'native_modules');
      });
    },
  },
  new webpack.DefinePlugin({
    __ENVIRONMENT__: JSON.stringify(
      ['development', 'production', 'testing']
        .find(item => item === process.env.MINDBUFFER_ENVIRONMENT) || 'production'
    ),
    __DEBUG__: JSON.stringify(
      (process.env.MINDBUFFER_DEBUG || '').toLowerCase() === 'true' // default false
    )
  })
];
