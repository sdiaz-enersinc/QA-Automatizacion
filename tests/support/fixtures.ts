// Tests using a fixture from this module MUST import test/expect from here,
// not from '@playwright/test', otherwise the fixture will be undefined.
import { expect } from '@playwright/test';
import { extendWithSharedSession } from './shared-session';
import { entryUrl } from './urls';
import { VALID_EMAIL } from './env';
import { EmailStepPage } from './pages/EmailStepPage';
import { PasswordStepPage } from './pages/PasswordStepPage';
import { DashboardPage } from './pages/DashboardPage';
import { CREDENTIALS_VIEW_TIMEOUT_MS } from './timeouts';

type AuthFixtures = {
  passwordStepPage: PasswordStepPage;
  dashboardPage: DashboardPage;
};

export const test = extendWithSharedSession<AuthFixtures>({
  /**
   * Drives the UI through the email step using VALID_EMAIL and
   * yields a PasswordStepPage already verified as ready. Test
   * scoped, so each test gets a fresh page and clean state.
   * Use only in unauthenticated projects (email-auth, password-auth).
   */
  passwordStepPage: async ({ page }, use) => {
    await page.goto(entryUrl());
    await new EmailStepPage(page).submit(VALID_EMAIL);

    const passwordStep = new PasswordStepPage(page);
    await passwordStep.expectReady(VALID_EMAIL, CREDENTIALS_VIEW_TIMEOUT_MS);

    await use(passwordStep);
  },

  /**
   * Opens the authenticated dashboard in the shared worker session.
   * Navigates back to the main page before each test so the next test
   * starts from a known authenticated shell.
   */
  dashboardPage: async ({ page }, use) => {
    await page.goto(entryUrl());
    const dashboard = new DashboardPage(page);
    await dashboard.expectLoaded();
    await use(dashboard);
  },
});

export { expect };
