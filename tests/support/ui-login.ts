import { expect, Page } from '@playwright/test';
import { VALID_EMAIL, VALID_PASSWORD } from './env';
import { entryUrl } from './urls';
import { EmailStepPage } from './pages/EmailStepPage';
import { PasswordStepPage } from './pages/PasswordStepPage';
import { DashboardPage } from './pages/DashboardPage';
import { CREDENTIALS_VIEW_TIMEOUT_MS, DASHBOARD_LOAD_TIMEOUT_MS } from './timeouts';

/**
 * Signs in through the email and password UI until the authenticated dashboard loads.
 * Login screens are shared; tenant-specific data is not required for this flow.
 *
 * @param page - Playwright page used for the login flow.
 */
export async function loginViaUi(page: Page): Promise<void> {
  await page.goto(entryUrl());
  await new EmailStepPage(page).submit(VALID_EMAIL);

  const passwordStep = new PasswordStepPage(page);
  await passwordStep.expectReady(VALID_EMAIL, CREDENTIALS_VIEW_TIMEOUT_MS);
  await passwordStep.passwordInput().fill(VALID_PASSWORD);
  await passwordStep.entrarBtn().click();

  await expect(passwordStep.passwordInput()).not.toBeVisible({
    timeout: DASHBOARD_LOAD_TIMEOUT_MS,
  });
  await new DashboardPage(page).expectLoaded();
}
