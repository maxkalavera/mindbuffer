import { readFileSync} from 'node:fs'
import { resolve } from 'node:path'

import type { Configuration } from 'electron-builder'

const pkg = JSON.parse(readFileSync(resolve('./package.json'), { encoding: 'utf8' }));

export default {
  appId: pkg.name,
  productName: pkg.productName,
  asar: true,
  npmRebuild: true,
  linux: {
    // "icon": "./resources/linux/icons/",
    target: [
      {
        target: "appImage",
        arch: [
          "x64",
          "armv7l",
          "arm64"
        ]
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
    target: ['dmg'],
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
  directories: {
    output: "dist"
  },
  win: {
    //"icon": "./resources/build/icon.ico",
    artifactName: "${productName}-${os}-${arch}.${ext}",
    target: [
      "nsis",
      "portable",
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
