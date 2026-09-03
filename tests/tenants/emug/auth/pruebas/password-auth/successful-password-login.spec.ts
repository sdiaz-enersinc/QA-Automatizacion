// spec: specs/post-email-login.plan.md

import { test, expect } from '../../../../../support/fixtures';
import { VALID_EMAIL, VALID_PASSWORD } from '../../../../../support/env';
import { DashboardPage } from '../../../../../support/pages/DashboardPage';
import { DASHBOARD_LOAD_TIMEOUT_MS } from '../../../../../support/timeouts';

test.describe('Inicio de sesión post-correo (autenticación por contraseña)', () => {
  test('Inicio de sesión exitoso (correo y contraseña válidos)', async ({ passwordStepPage, page }) => {
    await expect(passwordStepPage.usernameInput()).toHaveValue(VALID_EMAIL);
    await expect(passwordStepPage.passwordInput()).toBeVisible();
    await expect(passwordStepPage.entrarBtn()).toBeDisabled();

    await passwordStepPage.passwordInput().fill(VALID_PASSWORD);
    await expect(passwordStepPage.entrarBtn()).toBeEnabled();

    await passwordStepPage.entrarBtn().click();
    await expect(passwordStepPage.passwordInput()).not.toBeVisible({
      timeout: DASHBOARD_LOAD_TIMEOUT_MS,
    });
    await new DashboardPage(page).expectLoaded();
  });
});
