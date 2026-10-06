// plan: specs/Registro/sireci-playwright-test.plan.md
// semilla: tests/tenants/gecg/registro/pruebas/sireci/seed-sireci.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test, expect } from '../../../../../support/fixtures';
import { REGISTRO_NAVIGATION_DASHBOARD_PREVIEW_LABELS } from '../../../../../support/pages/registro/navigation';
import {
  REGISTRO_SIRECI_DEFAULT_TAB,
  RegistroSireciNavigationPage,
} from '../../../../../support/pages/registro/sireci';

test.describe('Sireci — Ruta B (hover del tablero)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroSireci);
  });

  test('Ruta B — El hover del tablero abre Sireci en Resumen', async ({ page, dashboardPage }) => {
    const registro = new RegistroSireciNavigationPage(page);

    await test.step('1. Validar el shell del tablero y la tarjeta de Registro', async () => {
      await dashboardPage.expectLoaded();
      await expect(registro.registroDashboardCard()).toBeVisible();
      for (const label of REGISTRO_NAVIGATION_DASHBOARD_PREVIEW_LABELS) {
        await expect(registro.registroDashboardCard().getByText(label)).toBeVisible();
      }
    });

    await test.step('2. Abrir Sireci desde el hover de la tarjeta Registro', async () => {
      await registro.expectSireciVisibleOnDashboardHover();
      await registro.openSireciFromDashboardGrid();
    });

    await test.step('3. Validar la vista activa de Resumen', async () => {
      await registro.expectSireciViewActive(REGISTRO_SIRECI_DEFAULT_TAB);
      await expect(page.getByRole('main').getByRole('table').first()).toBeVisible();
    });
  });
});
