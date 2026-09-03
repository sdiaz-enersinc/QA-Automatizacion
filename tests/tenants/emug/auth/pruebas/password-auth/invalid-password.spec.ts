// spec: specs/post-email-login.plan.md
// seed: tests/auth.setup.ts

import { test, expect } from '../../../../../support/fixtures';
import { INVALID_PASSWORD, VALID_EMAIL } from '../../../../../support/env';

test.describe('Inicio de sesión post-correo (autenticación por contraseña)', () => {
  test('Contraseña inválida mantiene al usuario en la vista de credenciales con error en línea', async ({
    passwordStepPage,
    page,
  }) => {
    // 1. Iniciar en la vista de credenciales vía fixture passwordStepPage (correo ya enviado con VALID_EMAIL).
    await expect(passwordStepPage.usernameInput()).toHaveValue(VALID_EMAIL);
    await expect(passwordStepPage.entrarBtn()).toBeDisabled();

    // 2. Rellenar contraseña con INVALID_PASSWORD.
    await passwordStepPage.passwordInput().fill(INVALID_PASSWORD);
    await expect(passwordStepPage.entrarBtn()).toBeEnabled();

    // 3. Enviar credenciales inválidas y verificar el error en línea y el estado de recuperación.
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
