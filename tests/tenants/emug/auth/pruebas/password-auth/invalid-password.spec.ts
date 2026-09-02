// spec: specs/post-email-login.plan.md
// seed: tests/auth.setup.ts

import { test, expect } from '../../../../../support/fixtures';
import { INVALID_PASSWORD, VALID_EMAIL } from '../../../../../support/env';

test.describe('Post-email login (password authentication)', () => {
  test('Invalid password keeps user on credentials view with inline error', async ({
    passwordStepPage,
    page,
  }) => {
    // 1. Start on credentials view via passwordStepPage fixture (email already submitted with VALID_EMAIL).
    await expect(passwordStepPage.usernameInput()).toHaveValue(VALID_EMAIL);
    await expect(passwordStepPage.entrarBtn()).toBeDisabled();

    // 2. Fill password with INVALID_PASSWORD.
    await passwordStepPage.passwordInput().fill(INVALID_PASSWORD);
    await expect(passwordStepPage.entrarBtn()).toBeEnabled();

    // 3. Submit invalid credentials and verify the inline error and recovery state.
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
