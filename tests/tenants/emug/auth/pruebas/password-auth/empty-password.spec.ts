// spec: specs/post-email-login.plan.md
// seed: tests/auth.setup.ts

import { test, expect } from '../../../../../support/fixtures';
import { VALID_EMAIL } from '../../../../../support/env';

test.describe('Inicio de sesión post-correo (autenticación por contraseña)', () => {
  test('Contraseña vacía mantiene Entrar deshabilitado y evita el envío', async ({
    passwordStepPage,
    page,
  }) => {
    const passwordInput = passwordStepPage.passwordInput();
    const entrarBtn = passwordStepPage.entrarBtn();

    // 1. Iniciar en la vista de credenciales vía fixture passwordStepPage, contraseña vacía por defecto.
    await expect(passwordStepPage.usernameInput()).toHaveValue(VALID_EMAIL);
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveValue('');
    await expect(entrarBtn).toBeVisible();
    await expect(entrarBtn).toBeDisabled();

    // 2. Enfocar contraseña y Tab sin escribir.
    await passwordInput.click();
    await page.keyboard.press('Tab');
    await expect(passwordInput).toHaveValue('');
    await expect(entrarBtn).toBeDisabled();
    await expect(page.getByText('Credenciales inválidas')).not.toBeVisible();
    await expect(page.getByText('Ocurrió un error inesperado, intenta nuevamente.')).not.toBeVisible();

    // 3. Verificar que Entrar permanece deshabilitado y el tablero autenticado no es accesible.
    await expect(entrarBtn).toBeDisabled();
    await expect(passwordInput).toBeVisible();
    await expect(page.getByText('Bienvenido a Enersinc')).not.toBeVisible();
  });
});
