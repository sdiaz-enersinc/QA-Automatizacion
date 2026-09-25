import { Page } from '@playwright/test';

/**
 * Page object del paso inicial de autorización solo por correo
 * (pantalla «Bienvenido al ETRM»). Encapsula localizadores por rol
 * para que los consumidores no dependan del copy ni de la estructura del DOM.
 */
export class EmailStepPage {
  constructor(private readonly page: Page) {}

  emailInput = () => this.page.getByRole('textbox', { name: '* Correo electrónico' });
  continueBtn = () => this.page.getByRole('button', { name: 'Continuar' });

  /**
   * Rellena el campo de correo con la dirección dada y pulsa
   * Continuar para pasar a la vista de credenciales.
   *
   * @param email - Dirección ingresada en el paso de autorización por correo.
   */
  async submit(email: string): Promise<void> {
    await this.emailInput().fill(email);
    await this.continueBtn().click();
  }
}
