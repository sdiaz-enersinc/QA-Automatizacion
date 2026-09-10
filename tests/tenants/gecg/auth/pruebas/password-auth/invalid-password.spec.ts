// spec: specs/post-email-login.plan.md
// seed: tests/auth.setup.ts

import { test, expect } from '../../../../../support/fixtures';
import { INVALID_PASSWORD, VALID_EMAIL } from '../../../../../support/env';

test.describe('Inicio de sesión post-correo (autenticación por contraseña)', () => {
  test('Contraseña inválida mantiene al usuario en la vista de credenciales con error en línea', async ({
    passwordStepPage,
    page,
  }) => {
    await expect(passwordStepPage.usernameInput()).toHaveValue(VALID_EMAIL);
    await expect(passwordStepPage.entrarBtn()).toBeDisabled();

    await passwordStepPage.passwordInput().fill(INVALID_PASSWORD);
    await expect(passwordStepPage.entrarBtn()).toBeEnabled();

    await passwordStepPage.entrarBtn().click();
    await expect(passwordStepPage.invalidCredentialsFeedback()).toBeVisible({
      timeout: 15_000,
    });
    await expect(passwordStepPage.passwordInput()).toHaveValue('');
    await expect(passwordStepPage.entrarBtn()).toBeDisabled();
    await expect(passwordStepPage.usernameInput()).toHaveValue(VALID_EMAIL);
    await expect(page.getByText('Bienvenido a Enersinc')).not.toBeVisible();
  });
});
