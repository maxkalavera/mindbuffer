import path from 'path'
import { platform, arch } from 'os'
import { beforeEach, afterEach } from '@jest/globals';
import webdriver from 'selenium-webdriver'
import knex from 'knex'

import emptyDatabase from './utils/emptyDatabase';
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

try {
  global.queries = knex({
    client: 'sqlite3',
    debug: global.DEBUG,
    connection: {
      filename: path.resolve('.run/mindbuffer.test.db') as string,
    },
    useNullAsDefault: true,
  })
} catch (error) {
  console.error(error);
}

global.webdriver = undefined as webdriver.ThenableWebDriver
beforeAll(async () => {
  global.webdriver = await buildWebdriver()
});
afterAll(async () => {
  const driver = global.webdriver as webdriver.ThenableWebDriver;
  await driver.quit()
  const queries = global.queries as knex.Knex<any, unknown[]>
  queries.destroy()
})

// When DEBUG mode deactivate retries
jest.retryTimes(global.DEBUG ? 0 : 2)