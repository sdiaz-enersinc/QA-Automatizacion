import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const tenant = process.env.TEST_TENANT ?? 'emug';
const tenantSpecMatch = new RegExp(`tenants/${tenant}/.*\\.spec\\.ts$`);
const unauthTestMatch = new RegExp(
  `tenants/${tenant}/auth/pruebas/(?:email-auth|password-auth)/`,
);

const BROWSERS = [
  { name: 'chromium', device: devices['Desktop Chrome'] },
  { name: 'firefox', device: devices['Desktop Firefox'] },
  { name: 'webkit', device: devices['Desktop Safari'] },
] as const;

/**
 * Configuración mínima de Playwright para el import progresivo.
 * Specs viven en tests/tenants/<tenant>/<modulo>/pruebas/.
 * Aún no incluye reporters CSV ni harvest.
 */
export default defineConfig({
  testDir: './tests',
  globalSetup: require.resolve('./tests/global-setup.ts'),
  testMatch: [tenantSpecMatch],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  reporter: [['list'], ['html']],
  use: {
    baseURL: process.env.BASE_URL,
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      'QA-Bypass-Token': process.env.TOKEN_BYPASS || '',
    },
    trace: 'on-first-retry',
    launchOptions: {
      slowMo: 500,
    },
  },

  projects: [
    ...BROWSERS.flatMap(({ name, device }) => [
      {
        name,
        use: { ...device },
        testIgnore: [/auth\.setup\.ts/, unauthTestMatch],
      },
      {
        name: `${name}-unauth`,
        use: { ...device },
        testMatch: unauthTestMatch,
      },
    ]),
  ],
});
