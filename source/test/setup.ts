import path from 'path'
import { platform, arch } from 'os'
import pkg from '../../package.json'

const platformDict = {
  'darwin': 'mac',
  'linux': 'linux',
  'win32': 'win'
}
const baseDir = path.resolve('./.package', `./dist/${platformDict[platform()]}-${arch()}`)

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

jest.retryTimes(3)