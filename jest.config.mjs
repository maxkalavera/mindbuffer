import globals from './globals.mjs'

const config = {
  verbose: true,
  testEnvironment: 'node',
  testTimeout: 10 * 1000,
  openHandlesTimeout: 5 * 1000,
  moduleDirectories: ["node_modules", "source/test"],
  rootDir: './',
  //setupFiles: [
  //  "<rootDir>/source/test/setup.ts",
  //],
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
  globals,
};

export default config;