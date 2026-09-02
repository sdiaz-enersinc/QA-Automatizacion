// spec: specs/initial-email-authorization.plan.md
// seed: tests/auth.setup.ts

import { test, expect } from '@playwright/test';
import { entryUrl } from '../../../../../support/urls';
import { INVALID_EMAIL } from '../../../../../support/env';

test.describe('Email authorization', () => {
  test('Unsuccessful email authorization (not registered)', async ({ page }) => {
    // 1. Open the application base URL in a fresh browser context with no stored session.
    await page.goto(entryUrl());
    await expect(page.getByRole('textbox', { name: '* Correo electrónico' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continuar' })).toBeVisible();

    // 2. Enter a syntactically valid email that is not registered for this environment, for example user@gmail.com.
    await page.getByRole('textbox', { name: '* Correo electrónico' }).fill(INVALID_EMAIL);
    await expect(page.getByText('El correo no tiene un formato válido')).not.toBeVisible();

    // 3. Click Continuar.
    await page.getByRole('button', { name: 'Continuar' }).click();
    await expect(page.getByRole('textbox', { name: 'Nombre de usuario' })).not.toBeVisible();
    await expect(page.getByText('Error')).toBeVisible();
    await expect(page.getByText('Usuario no registrado.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: '* Correo electrónico' })).toBeVisible();

    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByRole('textbox', { name: '* Correo electrónico' })).toBeVisible();
    await expect(page.getByText('Usuario no registrado.')).not.toBeVisible();
  });
});
