// spec: specs/initial-email-authorization.plan.md
// seed: tests/auth.setup.ts

import { test, expect } from '@playwright/test';
import { entryUrl } from '../../../../../support/urls';
import { VALID_EMAIL, BASE_URL } from '../../../../../support/env';

test.describe('Autorización por correo electrónico', () => {
  test('Validación de correo exitosa (correo autorizado)', async ({ page }) => {
    // 1. Abrir la URL base de la aplicación en un contexto de navegador nuevo sin sesión almacenada.
    await page.goto(entryUrl());
    await expect(page.getByRole('heading', { name: 'Bienvenido al' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'ETRM' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: '* Correo electrónico' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continuar' })).toBeVisible();

    // 2. En el textbox etiquetado Correo electrónico
    await page.getByRole('textbox', { name: '* Correo electrónico' }).fill(VALID_EMAIL);
    await expect(page.getByRole('textbox', { name: '* Correo electrónico' })).toHaveValue(
      VALID_EMAIL,
    );
    await expect(page.getByText('El correo no tiene un formato válido')).not.toBeVisible();

    // 3. Pulsar el botón Continuar.
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
