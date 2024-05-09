
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

import JSONPackage from './package.json'
import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

import type { ForgeConfig } from '@electron-forge/shared-types';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    executableName: JSONPackage.productName,
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-dmg',
      config: {
        background: './resources/dmg/background.png',
        icon: './resources/dmg/atom.icns',
        format: 'ULFO'
      },
      platforms: [
        'darwin'
      ],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          bin: JSONPackage.productName,
          description: JSONPackage.description,
          productName: JSONPackage.productName,
          maintainer: 'Max Hernandez',
          homepage: 'https://maxkalavera.github.io/',
        }
      }
    },
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        authors: 'Max Hernandez',
        exe: `${JSONPackage.productName}.exe`,
        name: JSONPackage.productName,
      }
    }
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'maxkalavera',
          name: 'mindbuffer'
        },
        draft: true,
      }
    }
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/assets/index.html',
            js: './src/renderer.tsx?',
            name: 'main_window',
            preload: {
              js: './src/preload.ts',
            },
          },
        ],
      },
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
      [FuseV1Options.LoadBrowserProcessSpecificV8Snapshot]: false,

    }),
  ],
};

export default config;
