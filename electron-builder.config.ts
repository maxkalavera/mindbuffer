import { readFileSync} from 'node:fs'
import { resolve } from 'node:path'
import rebuild from '@electron/rebuild'

import type { Configuration } from 'electron-builder'

const pkg = JSON.parse(readFileSync(resolve('./package.json'), { encoding: 'utf8' }));

/*
  Architectures:
    "x64", // UMD 64 bits also compatible with Intel64
    "arm64" // ARM 64 bits
    "armv7l" // ARM ussualy used in Android phones and Raspberry PI, not supported by Sqlite3
*/

export default {
  appId: pkg.name,
  productName: pkg.productName,
  asar: true,
  npmRebuild: true,
  directories: {
    output: "distribution/"
  },
  linux: {
    // "icon": "./resources/linux/icons/",
    target: [
      {
        target: "deb",
        arch: pkg.build.architectures.linux
      },
      {
        target: "appImage",
        arch: pkg.build.architectures.linux
      }
    ],
    category: "Utility",
    synopsis: pkg.package,
    artifactName: pkg.productName + "${productName}-${os}-${arch}.${ext}",
    desktop: {
      Name: pkg.productName,
      Type: "Application",
      Comment: pkg.description,
      Terminal: "false"
    }
  },
  mac: {
    target: [
      {
        target: 'dmg',
        arch: pkg.build.architectures.mac
      }
    ],
    category: "public.app-category.productivity",
    darkModeSupport: false,
    // entitlements: "./resources/mac/entitlements.plist",
    //entitlementsInherit: "./resources/mac/entitlements.plist",
    gatekeeperAssess: false,
    hardenedRuntime: true,
    //"icon": "./resources/mac/icons/icon.icns",
    //notarize: { "teamId": "" }
  },
  dmg: {
    artifactName: "${productName}-${os}-${arch}.${ext}",
    // background: "./resources/mac/background.png",
    contents: [
      {
        x: 396,
        y: 345,
        type: "link",
        path: "/Applications"
      },
      {
        x: 396,
        y: 110,
        type: "file"
      }
    ],
    window: {
      width: 640,
      height: 480
    }
  },
  win: {
    //"icon": "./resources/build/icon.ico",
    artifactName: "${productName}-${os}-${arch}.${ext}",
    target: [
      {
        target: "nsis",
        arch: pkg.build.architectures.win
      },
      {
        target: "portable",
        arch: pkg.build.architectures.win
      }
    ],
    "publisherName": pkg.author.name
  },
  nsis: {
    artifactName: "${productName}-${os}-${arch}.${ext}",
    oneClick: false,
    perMachine: false,
  },
  portable: {
    artifactName: "${productName}-${os}-${version}-portable.${ext}"
  }
} as Configuration;
