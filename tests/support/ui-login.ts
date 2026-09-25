import { expect, Page } from '@playwright/test';
import { VALID_EMAIL, VALID_PASSWORD } from './env';
import { entryUrl } from './urls';
import { EmailStepPage } from './pages/EmailStepPage';
import { PasswordStepPage } from './pages/PasswordStepPage';
import { DashboardPage } from './pages/DashboardPage';
import { CREDENTIALS_VIEW_TIMEOUT_MS, DASHBOARD_LOAD_TIMEOUT_MS } from './timeouts';

/**
 * Inicia sesión por la UI de correo y contraseña hasta que carga el tablero autenticado.
 * Las pantallas de login son compartidas; este flujo no requiere datos específicos del tenant.
 *
 * @param page - Página de Playwright usada para el login.
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
