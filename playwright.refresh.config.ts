import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

/**
 * Playwright config for the dropdown harvest maintenance runner.
 * Kept separate so `refresh-dropdown-options.spec.ts` is not part of the tenant suite.
 */
export default defineConfig({
  testDir: './scripts',
  globalSetup: require.resolve('./tests/global-setup.ts'),
  testMatch: /refresh-dropdown-options\.spec\.ts$/,
  fullyParallel: false,
  workers: 1,
  timeout: 300_000,
  reporter: [['list']],
  use: {
    baseURL: process.env.BASE_URL,
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      'QA-Bypass-Token': process.env.TOKEN_BYPASS || '',
    },
    trace: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
