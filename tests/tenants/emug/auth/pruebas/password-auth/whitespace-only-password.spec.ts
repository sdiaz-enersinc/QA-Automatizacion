// spec: specs/post-email-login.plan.md
// seed: tests/auth.setup.ts

import { test, expect } from '../../../../../support/fixtures';
import { VALID_EMAIL } from '../../../../../support/env';

const WHITESPACE_PASSWORD = '     ';

test.describe('Inicio de sesión post-correo (autenticación por contraseña)', () => {
  test('Contraseña solo con espacios en blanco es rechazada con error genérico', async ({
    passwordStepPage,
    page,
  }) => {
    const passwordInput = passwordStepPage.passwordInput();
    const entrarBtn = passwordStepPage.entrarBtn();
    const unexpectedErrorAlert = page.getByText('Ocurrió un error inesperado, intenta nuevamente.');
    const closeAlertBtn = page.getByRole('button', { name: 'close' });

    // 1. Iniciar en la vista de credenciales vía fixture passwordStepPage (correo ya enviado con VALID_EMAIL).
    await expect(entrarBtn).toBeVisible();
    await expect(entrarBtn).toBeDisabled();

    // 2. Rellenar contraseña solo con espacios — el formulario no recorta en cliente, por lo que Entrar se habilita.
    await passwordInput.fill(WHITESPACE_PASSWORD);
    await expect(entrarBtn).toBeEnabled();
    await expect(unexpectedErrorAlert).not.toBeVisible();

    // 3. Enviar contraseña solo con espacios y verificar error genérico (NO 'Credenciales inválidas').
    await entrarBtn.click();
    await expect(unexpectedErrorAlert).toBeVisible();
    await expect(page.getByText('Credenciales inválidas')).not.toBeVisible();
    await expect(passwordStepPage.usernameInput()).toHaveValue(VALID_EMAIL);
    await expect(passwordInput).toBeVisible();
    await expect(page.getByText('Bienvenido a Enersinc')).not.toBeVisible();

    // 4. Pulsar el botón de cerrar en la alerta en línea para descartarla.
    await closeAlertBtn.click();
    await expect(unexpectedErrorAlert).not.toBeVisible();
  });
});
