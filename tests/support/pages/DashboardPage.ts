import { Locator, Page, expect } from '@playwright/test';
import { DASHBOARD_LOAD_TIMEOUT_MS } from '../timeouts';

/**
 * Page object for the authenticated application shell after a successful
 * login (welcome region, primary side navigation, layout controls). Extend
 * this class with feature-specific sections as new dashboard tests are added.
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
   * Asserts the post-login dashboard shell is visible and stable enough
   * for further navigation or feature tests.
   *
   * @param timeoutMs - Max wait per assertion; defaults to {@link DASHBOARD_LOAD_TIMEOUT_MS}.
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
