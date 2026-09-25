import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

/**
 * Config de Playwright del runner de mantenimiento de desplegables.
 * Va aparte para que `refresh-dropdown-options.spec.ts` no entre en la suite de tenant.
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
