import { readFileSync} from 'node:fs'
import { resolve } from 'node:path'

import type { Configuration } from 'electron-builder'

const pkg = JSON.parse(readFileSync(resolve('./package.json'), { encoding: 'utf8' }));

export default {
  appId: pkg.name,
  productName: pkg.productName,
  asar: false,
  linux: { target: ['dir'] },
  mac: { target: ['dir'] },
  win: { target: ['dir'] }
} as Configuration;
