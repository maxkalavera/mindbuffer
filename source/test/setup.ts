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
const distributionDir = path.resolve('./.package/distribution/')

switch(platform()) {
  case 'linux':
    global.__BINARY_PATH__ = path.resolve(distributionDir, `linux-unpacked/${pkg.name}`)
    break;
  case 'darwin':
    global.__BINARY_PATH__ = path.resolve(
      distributionDir, 
      `${platformDict[platform()]}-${arch()}/${pkg.productName}.app/Contents/MacOS/${pkg.productName}`
    )
    break;
  case 'win32':
    global.__BINARY_PATH__ = path.resolve(distributionDir, `win-unpacked/${pkg.productName}.exe`)
    break;
}

global.webdriver = undefined as webdriver.ThenableWebDriver
beforeEach(() => {
  global.webdriver = buildWebdriver()
});
afterEach(async () => {
  if (!global.DEBUG) {
    await global.webdriver.quit()
  }
});

//jest.retryTimes(global.DEBUG ? 0 : 2)
jest.retryTimes(0)