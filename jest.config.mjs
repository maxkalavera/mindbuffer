import globals from './globals.mjs'

const testingGlobals = Object.assign(globals, {
  SHORT: 15 * 1000,
  MEDIUM: 60 * 1000,
  LONG : 3 * 60 * 1000,
})

const config = {
  verbose: true,
  testEnvironment: 'node',
  testTimeout: globals.SHORT,
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