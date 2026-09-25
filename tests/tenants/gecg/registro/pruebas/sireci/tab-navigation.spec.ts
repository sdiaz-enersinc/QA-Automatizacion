// spec: specs/Registro/sireci-playwright-test.plan.md
// seed: tests/tenants/gecg/registro/pruebas/sireci/seed-sireci.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test, expect } from '../../../../../support/fixtures';
import { RegistroSireciNavigationPage } from '../../../../../support/pages/registro/sireci';

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
      await registro.openSireciFromSidebar('Resumen');
      await registro.expectSireciViewActive('Resumen');
      await registro.expectSireciPairTabVisible('Resumen');
    });

    await test.step('2. Abrir la pestaña Reporte', async () => {
      await registro.openSireciTab('Reporte');
      await expect(page.getByRole('main').getByRole('table').first()).toBeVisible();
      await registro.expectSireciPairTabVisible('Reporte');
    });

    await test.step('3. Volver a la pestaña Resumen', async () => {
      await registro.openSireciTab('Resumen');
      await expect(page.getByRole('button', { name: 'Descargar Reporte' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Nuevo Registro' })).toBeVisible();
    });
  });
});
