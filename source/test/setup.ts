import path from 'path'
import { platform, arch } from 'os'
import { beforeEach, afterEach } from '@jest/globals';
import webdriver from 'selenium-webdriver'

import buildWebdriver from './buildWebdriver';
import pkg from '../../package.json'

const platformDict = {
  'darwin': 'mac',
  'linux': 'linux',
  'win32': 'win'
}
const baseDir = path.resolve('./.package', `./distribution/${platformDict[platform()]}-${arch()}`)

switch(platform()) {
  case 'linux':
    global.__BINARY_PATH__ = path.resolve(baseDir, `${pkg.productName}`)
    break;
  case 'darwin':
    global.__BINARY_PATH__ = path.resolve(baseDir, `${pkg.productName}.app/Contents/MacOS/${pkg.productName}`)
    break;
  case 'win32':
    global.__BINARY_PATH__ = path.resolve(baseDir, `${pkg.productName}.exe`)
    break;
}

jest.retryTimes(global.DEBUG ? 0 : 2)

global.webdriver = undefined as webdriver.ThenableWebDriver
beforeEach(() => {
  global.webdriver = buildWebdriver()
});
afterEach(async () => {
  if (!global.DEBUG) {
    await global.webdriver.quit()
  }
});
