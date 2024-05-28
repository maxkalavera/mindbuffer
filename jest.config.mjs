import globals from './globals.mjs'

const testingGlobals = Object.assign(globals, {
  WAIT_UNTIL_TIMEOUT: 10 * 1000,
  EXTRA_SHORT_TIMEOUT: 5 * 1000,
  SHORT_TIMEOUT: 10 * 1000,
  REGULAR_TIMEOUT: 30 * 1000,
  LONG_TIMEOUT : 2 * 60 * 1000,
  EXTRA_LONG_TIMEOUT: 5 * 60 * 1000,
})

const config = {
  verbose: true,
  testEnvironment: 'node',
  testTimeout: testingGlobals.REGULAR_TIMEOUT,
  openHandlesTimeout: 1000,
  moduleDirectories: ["node_modules", "source/test"],
  rootDir: './',
  setupFilesAfterEnv: [
    "<rootDir>/source/test/setup.ts",
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
  },
  globals: testingGlobals,
};

export default config;