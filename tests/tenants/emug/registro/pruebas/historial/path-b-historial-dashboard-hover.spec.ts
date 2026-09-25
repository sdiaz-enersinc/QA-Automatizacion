// plan: specs/Registro/historial-playwright-test.plan.md
// semilla: tests/tenants/emug/registro/historial/seed-historial.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test, expect } from '../../../../../support/fixtures';
import { REGISTRO_NAVIGATION_DASHBOARD_PREVIEW_LABELS } from '../../../../../support/pages/registro/navigation';
import {
  REGISTRO_HISTORIAL_DEFAULT_TAB,
  RegistroHistorialNavigationPage,
} from '../../../../../support/pages/registro/historial';

test.describe('Historial — Ruta B (hover del tablero)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroHistorial);
  });

  test('Ruta B — El hover del tablero abre Historial en Operaciones multiples', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroHistorialNavigationPage(page);

    await test.step('1. Validar el shell del tablero y la tarjeta de Registro', async () => {
      await dashboardPage.expectLoaded();
      await expect(registro.registroDashboardCard()).toBeVisible();
      for (const label of REGISTRO_NAVIGATION_DASHBOARD_PREVIEW_LABELS) {
        await expect(registro.registroDashboardCard().getByText(label)).toBeVisible();
      }
    });

    await test.step('2. Abrir Historial desde el hover de la tarjeta Registro', async () => {
      await registro.expectHistorialVisibleOnDashboardHover();
      await registro.openHistorialFromDashboardGrid();
    });

    await test.step('3. Validar la vista activa de Operaciones multiples', async () => {
      await registro.expectHistorialViewActive(REGISTRO_HISTORIAL_DEFAULT_TAB);
      await expect(page.getByRole('main').getByRole('searchbox', { name: /Buscar/i })).toBeVisible();
      await expect(page.getByRole('main').getByRole('table').first()).toBeVisible();
    });
  });
});
