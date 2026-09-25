import { Locator, Page, expect } from '@playwright/test';
import { DASHBOARD_LOAD_TIMEOUT_MS } from '../timeouts';

/**
 * Page object del shell autenticado tras un login exitoso
 * (región de bienvenida, navegación lateral primaria, controles de layout).
 * Extender esta clase con secciones de producto a medida que se añadan pruebas del tablero.
 */
export class DashboardPage {
  constructor(private readonly page: Page) {}

  welcomeHeading = (): Locator => this.page.getByText('Bienvenido a Enersinc');
  tagline = (): Locator =>
    this.page.getByText('¡Optimiza tu energía y simplifica tus operaciones!');
  menuInicio = (): Locator => this.page.getByRole('menuitem', { name: 'Inicio' });
  menuRegistro = (): Locator => this.page.getByRole('menuitem', { name: 'Registro' });
  menuMdm = (): Locator => this.page.getByRole('menuitem', { name: 'MDM' });
  menuFold = (): Locator => this.page.getByRole('button', { name: 'menu-fold' });

  /**
   * Comprueba que el shell del tablero post-login es visible y está lo bastante
   * estable para seguir navegando o ejecutar pruebas de módulo.
   *
   * @param timeoutMs - Espera máxima por aserción; por defecto {@link DASHBOARD_LOAD_TIMEOUT_MS}.
   */
  async expectLoaded(timeoutMs: number = DASHBOARD_LOAD_TIMEOUT_MS): Promise<void> {
    await expect(this.welcomeHeading()).toBeVisible({ timeout: timeoutMs });
    await expect(this.tagline()).toBeVisible({ timeout: timeoutMs });
    await expect(this.menuInicio()).toBeVisible({ timeout: timeoutMs });
    await expect(this.menuRegistro()).toBeVisible({ timeout: timeoutMs });
    await expect(this.menuMdm()).toBeVisible({ timeout: timeoutMs });
    await expect(this.menuFold()).toBeVisible({ timeout: timeoutMs });
  }
}
