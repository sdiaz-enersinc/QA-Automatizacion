// spec: specs/Registro/sireci-playwright-test.plan.md
// seed: tests/tenants/gecg/registro/pruebas/sireci/seed-sireci.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test, expect } from '../../../../../support/fixtures';
import {
  REGISTRO_SIRECI_RESUMEN_COLUMNS,
  RegistroSireciNavigationPage,
} from '../../../../../support/pages/registro/sireci';

test.describe('Sireci — Pestaña Resumen', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroSireci);
    skipUnlessTabEnabled(MODULE_IDS.registroSireci, 'Resumen');
  });

  test.fixme('Filtro Modo Yo no funciona en Resumen — columnas, barra, chips y diálogo Nuevo Registro', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(30_000);
    const registro = new RegistroSireciNavigationPage(page);

    await test.step('1. Abrir Resumen desde el menú lateral y validar el shell', async () => {
      await dashboardPage.expectLoaded();
      await registro.openSireciFromSidebar('Resumen');
      await registro.expectGestorDeDatosSireciShell();
      await registro.expectSireciViewActive('Resumen');
    });

    await test.step('2. Validar columnas, barra, estado vacío o datos y filtros', async () => {
      await registro.expectGridColumnHeaders(REGISTRO_SIRECI_RESUMEN_COLUMNS);
      await registro.expectSireciResumenToolbar();
      await registro.expectGridHasDataOrEmptyState();
      await registro.expectModoYoFilterToggle();
      await registro.expectSireciResumenToolbar();
      await registro.expectEstadoFilterDialogWithCombobox();
      await registro.expectUsuariosFilterDialogWithCombobox();
    });

    await test.step('3. Validar diálogo Nuevo Registro y CTA Descargar Reporte', async () => {
      await registro.expectNuevoRegistroDialogOpensAndCloses();
      const descargar = page.getByRole('button', { name: 'Descargar Reporte' });
      await expect(descargar).toBeVisible();
      await expect(descargar).toBeEnabled();
    });
  });
});
