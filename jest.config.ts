import path from 'path'
import type {Config} from 'jest';

const config: Config = {
  verbose: true,
  testEnvironment: 'node',
  openHandlesTimeout: 3000,
  moduleDirectories: ["node_modules", "src"],
  setupFiles: [
    "<rootDir>/src/test/setup.ts",
  ],
  transformIgnorePatterns: [
    'node_modules/(?!' + [
      'selenium-webdriver',
    ].join('|') + ')',
  ],
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    "^.+\\.(js|jsx)$": 'babel-jest',
  }
};

export default config;