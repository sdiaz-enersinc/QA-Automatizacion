// spec: specs/initial-email-authorization.plan.md
// seed: tests/auth.setup.ts

import { test, expect } from '@playwright/test';
import { entryUrl } from '../../../../../support/urls';
import { VALID_EMAIL, BASE_URL } from '../../../../../support/env';

test.describe('Email authorization', () => {
  test('Successful email validation (authorized email)', async ({ page }) => {
    // 1. Open the application base URL in a fresh browser context with no stored session.
    await page.goto(entryUrl());
    await expect(page.getByRole('heading', { name: 'Bienvenido al' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'ETRM' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: '* Correo electrónico' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continuar' })).toBeVisible();

    // 2. In the textbox labeled Correo electrónico
    await page.getByRole('textbox', { name: '* Correo electrónico' }).fill(VALID_EMAIL);
    await expect(page.getByRole('textbox', { name: '* Correo electrónico' })).toHaveValue(
      VALID_EMAIL,
    );
    await expect(page.getByText('El correo no tiene un formato válido')).not.toBeVisible();

    // 3. Click the Continuar button.
    await page.getByRole('button', { name: 'Continuar' }).click();
    await expect(page.getByRole('textbox', { name: 'Nombre de usuario' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Nombre de usuario' })).toHaveValue(
      VALID_EMAIL,
    );
    await expect(page.getByRole('textbox', { name: 'Contraseña' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Entrar' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'google Ingresar con Google' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'path21 Ingresar con Azure' })).toBeVisible();
    await expect(page.getByRole('button', { name: '¿Olvidaste tu contraseña?' })).toBeVisible();
  });
});
