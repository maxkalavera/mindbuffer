import path from 'node:path'
import { defineConfig, devices } from '@playwright/test';

import globals from './globals.mjs';

const outputDir = path.resolve('./.run');
const testDir = path.resolve('./playwright');

export default defineConfig({
  outputDir: outputDir,
  testDir: testDir,
  fullyParallel: false,
  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,
  // Retry on CI or DEBUG only.
  retries: !!process.env.CI && !globals.DEBUG ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? 'github' : undefined,
});