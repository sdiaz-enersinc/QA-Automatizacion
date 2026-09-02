import { Page } from '@playwright/test';

/**
 * Page object for the initial email-only authorization step
 * (the "Bienvenido al ETRM" screen). Encapsulates role-based
 * locators so consumers do not depend on copy or DOM structure.
 */
export class EmailStepPage {
  constructor(private readonly page: Page) {}

  emailInput = () => this.page.getByRole('textbox', { name: '* Correo electrónico' });
  continueBtn = () => this.page.getByRole('button', { name: 'Continuar' });

  /**
   * Fills the email field with the given address and clicks
   * the Continuar button to advance to the credentials view.
   *
   * @param email - Address entered on the email authorization step.
   */
  async submit(email: string): Promise<void> {
    await this.emailInput().fill(email);
    await this.continueBtn().click();
  }
}
