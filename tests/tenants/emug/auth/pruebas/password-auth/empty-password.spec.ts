// spec: specs/post-email-login.plan.md
// seed: tests/auth.setup.ts

import { test, expect } from '../../../../../support/fixtures';
import { VALID_EMAIL } from '../../../../../support/env';

test.describe('Post-email login (password authentication)', () => {
  test('Empty password keeps Entrar disabled and prevents submission', async ({
    passwordStepPage,
    page,
  }) => {
    const passwordInput = passwordStepPage.passwordInput();
    const entrarBtn = passwordStepPage.entrarBtn();

    // 1. Start on credentials view via passwordStepPage fixture, password empty by default.
    await expect(passwordStepPage.usernameInput()).toHaveValue(VALID_EMAIL);
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveValue('');
    await expect(entrarBtn).toBeVisible();
    await expect(entrarBtn).toBeDisabled();

    // 2. Focus password and Tab away without typing.
    await passwordInput.click();
    await page.keyboard.press('Tab');
    await expect(passwordInput).toHaveValue('');
    await expect(entrarBtn).toBeDisabled();
    await expect(page.getByText('Credenciales inválidas')).not.toBeVisible();
    await expect(page.getByText('Ocurrió un error inesperado, intenta nuevamente.')).not.toBeVisible();

    // 3. Assert Entrar remains disabled and the authenticated dashboard is not reachable.
    await expect(entrarBtn).toBeDisabled();
    await expect(passwordInput).toBeVisible();
    await expect(page.getByText('Bienvenido a Enersinc')).not.toBeVisible();
  });
});
