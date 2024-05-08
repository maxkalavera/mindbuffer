import type {Config} from 'jest';

const config: Config = {
  verbose: true,
  testEnvironment: 'node',
  testTimeout: 10 * 1000,
  openHandlesTimeout: 5 * 1000,
  moduleDirectories: ["node_modules", "src"],
  setupFiles: [
    "<rootDir>/src/test/setup.ts",
  ],
  transformIgnorePatterns: [
    'node_modules/(?!' + [
      'selenium-webdriver',
      'uuid',
    ].join('|') + ')',
  ],
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    "^.+\\.(js|jsx)$": 'babel-jest',
  }
};

export default config;