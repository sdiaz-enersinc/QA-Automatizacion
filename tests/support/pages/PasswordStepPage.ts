import { Locator, Page, expect } from '@playwright/test';

/**
 * Page object for the credentials view shown after a successful
 * email authorization. Exposes role-based locators for the
 * username, password, primary action, SSO buttons and the forgot
 * password link, plus a readiness assertion helper.
 */
export class PasswordStepPage {
  constructor(private readonly page: Page) {}

  usernameInput = () => this.page.getByRole('textbox', { name: 'Nombre de usuario' });
  passwordInput = () => this.page.getByRole('textbox', { name: 'Contraseña' });
  entrarBtn = () => this.page.getByRole('button', { name: 'Entrar' });
  forgotPassword = () => this.page.getByRole('button', { name: '¿Olvidaste tu contraseña?' });
  googleSsoBtn = () => this.page.getByRole('button', { name: 'google Ingresar con Google' });
  azureSsoBtn = () => this.page.getByRole('button', { name: 'path21 Ingresar con Azure' });

  /**
   * Locator for invalid-credentials feedback after a failed login.
   * Matches either the inline alert under `#normal_login` or an Ant
   * Design notification title (WebKit runs have been observed to show
   * only the toast). `.first()` avoids strict-mode violations when
   * both surfaces render, as on Chromium.
   *
   * @returns Locator for the first matching error title node.
   */
  invalidCredentialsFeedback(): Locator {
    const inline = this.page
      .locator('#normal_login .ant-alert-title')
      .filter({ hasText: 'Credenciales inválidas' });
    const toast = this.page
      .locator('.ant-notification-notice-title')
      .filter({ hasText: 'Credenciales inválidas' });
    return inline.or(toast).first();
  }

  /**
   * Asserts the credentials view is fully rendered and that the
   * username field is prefilled with the expected value. The
   * Entrar button is expected to be visible but disabled because
   * no password has been entered yet.
   *
   * @param expectedUsername - Email or username shown in the read-only field after verification.
   * @param timeoutMs - Max wait per assertion (needed when the UI lingers on email verification).
   */
  async expectReady(expectedUsername: string, timeoutMs: number = 5_000): Promise<void> {
    await expect(this.usernameInput()).toBeVisible({ timeout: timeoutMs });
    await expect(this.usernameInput()).toHaveValue(expectedUsername, { timeout: timeoutMs });
    await expect(this.passwordInput()).toBeVisible({ timeout: timeoutMs });
    await expect(this.entrarBtn()).toBeVisible({ timeout: timeoutMs });
    await expect(this.entrarBtn()).toBeDisabled({ timeout: timeoutMs });
  }
}
