// spec: specs/Registro/historial-playwright-test.plan.md
// seed: tests/tenants/emug/registro/historial/seed-historial.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test, expect } from '../../../../../support/fixtures';
import { RegistroHistorialNavigationPage } from '../../../../../support/pages/registro/historial';

test.describe('Historial — Path B (hover del tablero)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroHistorial);
  });

  test('Path B — El hover del tablero abre Historial en Operaciones multiples', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroHistorialNavigationPage(page);

    await test.step('1. Validar el shell del tablero y la tarjeta de Registro', async () => {
      await dashboardPage.expectLoaded();
      await expect(registro.registroDashboardCard()).toBeVisible();
      await expect(registro.registroDashboardCard().getByText('Empresas')).toBeVisible();
      await expect(registro.registroDashboardCard().getByText('Cttos energía')).toBeVisible();
      await expect(registro.registroDashboardCard().getByText('Cttos combustible')).toBeVisible();
    });

    await test.step('2. Abrir Historial desde el hover de la tarjeta Registro', async () => {
      await registro.expectHistorialVisibleOnDashboardHover();
      await registro.openHistorialFromDashboardGrid();
    });

    await test.step('3. Validar la vista activa de Operaciones multiples', async () => {
      await registro.expectHistorialViewActive('Operaciones multiples');
      await expect(page.getByRole('main').getByRole('searchbox', { name: /Buscar/i })).toBeVisible();
      await expect(page.getByRole('main').getByRole('table').first()).toBeVisible();
    });
  });
});
