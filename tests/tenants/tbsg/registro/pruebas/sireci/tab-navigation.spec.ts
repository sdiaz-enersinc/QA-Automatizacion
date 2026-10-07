// plan: specs/Registro/sireci-playwright-test.plan.md
// semilla: tests/tenants/tbsg/registro/pruebas/sireci/seed-sireci.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test, expect } from '../../../../../support/fixtures';
import {
  REGISTRO_SIRECI_DEFAULT_TAB,
  REGISTRO_SIRECI_REPORTE_TAB,
  RegistroSireciNavigationPage,
} from '../../../../../support/pages/registro/sireci';

test.describe('Sireci — Navegación entre pestañas', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroSireci);
  });

  test('Navegación cruzada — Resumen ↔ Reporte actualiza URL, breadcrumb y aria-selected', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroSireciNavigationPage(page);

    await test.step('1. Abrir Resumen desde el menú lateral', async () => {
      await dashboardPage.expectLoaded();
      await registro.openSireciFromSidebar(REGISTRO_SIRECI_DEFAULT_TAB);
      await registro.expectSireciViewActive(REGISTRO_SIRECI_DEFAULT_TAB);
      await registro.expectSireciPairTabVisible(REGISTRO_SIRECI_DEFAULT_TAB);
    });

    await test.step('2. Abrir la pestaña Reporte', async () => {
      await registro.openSireciTab(REGISTRO_SIRECI_REPORTE_TAB);
      await expect(page.getByRole('main').getByRole('table').first()).toBeVisible();
      await registro.expectSireciPairTabVisible(REGISTRO_SIRECI_REPORTE_TAB);
    });

    await test.step('3. Volver a la pestaña Resumen', async () => {
      await registro.openSireciTab(REGISTRO_SIRECI_DEFAULT_TAB);
      await registro.expectSireciResumenToolbar();
    });
  });
});
