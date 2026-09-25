// spec: specs/Registro/sireci-playwright-test.plan.md
// seed: tests/tenants/gecg/registro/pruebas/sireci/seed-sireci.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test, expect } from '../../../../../support/fixtures';
import { RegistroSireciNavigationPage } from '../../../../../support/pages/registro/sireci';

test.describe('Sireci — Path B (hover del tablero)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroSireci);
  });

  test('Path B — El hover del tablero abre Sireci en Resumen', async ({ page, dashboardPage }) => {
    const registro = new RegistroSireciNavigationPage(page);

    await test.step('1. Validar el shell del tablero y la tarjeta de Registro', async () => {
      await dashboardPage.expectLoaded();
      await expect(registro.registroDashboardCard()).toBeVisible();
      await expect(registro.registroDashboardCard().getByText('Empresas')).toBeVisible();
      await expect(registro.registroDashboardCard().getByText('Cttos energía')).toBeVisible();
      await expect(registro.registroDashboardCard().getByText('Cttos combustible')).toBeVisible();
    });

    await test.step('2. Abrir Sireci desde el hover de la tarjeta Registro', async () => {
      await registro.expectSireciVisibleOnDashboardHover();
      await registro.openSireciFromDashboardGrid();
    });

    await test.step('3. Validar la vista activa de Resumen', async () => {
      await registro.expectSireciViewActive('Resumen');
      await expect(page.getByRole('main').getByRole('table').first()).toBeVisible();
    });
  });
});
