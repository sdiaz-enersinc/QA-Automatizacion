// spec: specs/initial-email-authorization.plan.md
// seed: tests/auth.setup.ts

import { test, expect } from '@playwright/test';
import { entryUrl } from '../../../../../support/urls';
import { INVALID_EMAIL } from '../../../../../support/env';

test.describe('Autorización por correo electrónico', () => {
  test('Autorización de correo fallida (usuario no registrado)', async ({ page }) => {
    // 1. Abrir la URL base de la aplicación en un contexto de navegador nuevo sin sesión almacenada.
    await page.goto(entryUrl());
    await expect(page.getByRole('textbox', { name: '* Correo electrónico' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continuar' })).toBeVisible();

    // 2. Introducir un correo sintácticamente válido no registrado en este entorno, por ejemplo user@gmail.com.
    await page.getByRole('textbox', { name: '* Correo electrónico' }).fill(INVALID_EMAIL);
    await expect(page.getByText('El correo no tiene un formato válido')).not.toBeVisible();

    // 3. Pulsar Continuar.
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
