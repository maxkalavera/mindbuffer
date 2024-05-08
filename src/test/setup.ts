import path from 'path';
import { platform, arch } from 'os';

import JSONPackage from '../../package.json'

const BASE_BINARY_PATH = path.resolve(__dirname, '../../out', `${JSONPackage.productName}-${platform()}-${arch()}`)

switch(platform()) {
  case 'linux':
    global.__BINARY_PATH__ = path.resolve(BASE_BINARY_PATH, `${JSONPackage.productName}`)
    break;
  case 'darwin':
    global.__BINARY_PATH__ = path.resolve(BASE_BINARY_PATH, 'MindBuffer.app/Contents/MacOS/MindBuffer')
    break;
  case 'win32':
    global.__BINARY_PATH__ = path.resolve(BASE_BINARY_PATH, `${JSONPackage.productName}.exe`)
    break;
}

jest.retryTimes(3)