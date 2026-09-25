import { Locator, Page, expect } from '@playwright/test';

/**
 * Page object de la vista de credenciales tras una autorización de correo exitosa.
 * Expone localizadores por rol para usuario, contraseña, acción primaria, botones SSO
 * y el enlace de contraseña olvidada, más un helper de aserción de listo.
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
   * Localizador del feedback de credenciales inválidas tras un login fallido.
   * Coincide con la alerta en línea bajo `#normal_login` o con el título de una
   * notificación Ant Design (en WebKit a veces solo aparece el toast).
   * `.first()` evita violaciones de modo estricto cuando ambas superficies
   * se renderizan, como en Chromium.
   *
   * @returns Localizador del primer nodo de título de error coincidente.
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
   * Comprueba que la vista de credenciales está renderizada y que el campo de
   * usuario viene precargado con el valor esperado. El botón Entrar debe verse
   * pero permanecer deshabilitado porque aún no hay contraseña.
   *
   * @param expectedUsername - Correo o usuario mostrado en el campo de solo lectura tras la verificación.
   * @param timeoutMs - Espera máxima por aserción (necesaria si la UI se detiene en la verificación de correo).
   */
  async expectReady(expectedUsername: string, timeoutMs: number = 10_000): Promise<void> {
    await expect(this.usernameInput()).toBeVisible({ timeout: timeoutMs });
    await expect(this.usernameInput()).toHaveValue(expectedUsername, { timeout: timeoutMs });
    await expect(this.passwordInput()).toBeVisible({ timeout: timeoutMs });
    await expect(this.entrarBtn()).toBeVisible({ timeout: timeoutMs });
    await expect(this.entrarBtn()).toBeDisabled({ timeout: timeoutMs });
  }
}
