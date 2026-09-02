// spec: specs/post-email-login.plan.md
// seed: tests/auth.setup.ts

import { test, expect } from '../../../../../support/fixtures';
import { VALID_EMAIL } from '../../../../../support/env';

const WHITESPACE_PASSWORD = '     ';

test.describe('Post-email login (password authentication)', () => {
  test('Whitespace-only password is rejected with a generic error', async ({
    passwordStepPage,
    page,
  }) => {
    const passwordInput = passwordStepPage.passwordInput();
    const entrarBtn = passwordStepPage.entrarBtn();
    const unexpectedErrorAlert = page.getByText('Ocurrió un error inesperado, intenta nuevamente.');
    const closeAlertBtn = page.getByRole('button', { name: 'close' });

    // 1. Start on credentials view via passwordStepPage fixture (email already submitted with VALID_EMAIL).
    await expect(entrarBtn).toBeVisible();
    await expect(entrarBtn).toBeDisabled();

    // 2. Fill password with whitespace-only - the form does not trim client-side, so Entrar enables.
    await passwordInput.fill(WHITESPACE_PASSWORD);
    await expect(entrarBtn).toBeEnabled();
    await expect(unexpectedErrorAlert).not.toBeVisible();

    // 3. Submit whitespace-only password and verify generic error (NOT 'Credenciales inválidas').
    await entrarBtn.click();
    await expect(unexpectedErrorAlert).toBeVisible();
    await expect(page.getByText('Credenciales inválidas')).not.toBeVisible();
    await expect(passwordStepPage.usernameInput()).toHaveValue(VALID_EMAIL);
    await expect(passwordInput).toBeVisible();
    await expect(page.getByText('Bienvenido a Enersinc')).not.toBeVisible();

    // 4. Click the close button on the inline alert to dismiss it.
    await closeAlertBtn.click();
    await expect(unexpectedErrorAlert).not.toBeVisible();
  });
});
