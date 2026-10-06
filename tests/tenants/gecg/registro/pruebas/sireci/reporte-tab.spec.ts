// plan: specs/Registro/sireci-playwright-test.plan.md
// semilla: tests/tenants/gecg/registro/pruebas/sireci/seed-sireci.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_SIRECI_REPORTE_COLUMNS,
  REGISTRO_SIRECI_REPORTE_TAB,
  RegistroSireciNavigationPage,
} from '../../../../../support/pages/registro/sireci';

test.describe('Sireci — Pestaña Reporte', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroSireci);
    skipUnlessTabEnabled(MODULE_IDS.registroSireci, REGISTRO_SIRECI_REPORTE_TAB);
  });

  test('Reporte — Columnas, barra y Descargar Reporte', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(30_000);
    const registro = new RegistroSireciNavigationPage(page);

    await test.step('1. Abrir Reporte desde el menú lateral y validar el shell', async () => {
      await dashboardPage.expectLoaded();
      await registro.openSireciFromSidebar(REGISTRO_SIRECI_REPORTE_TAB);
      await registro.expectGestorDeDatosSireciShell();
      await registro.expectSireciViewActive(REGISTRO_SIRECI_REPORTE_TAB);
      await registro.expectSireciPairTabVisible(REGISTRO_SIRECI_REPORTE_TAB);
    });

    await test.step('2. Validar columnas, barra y Descargar Reporte', async () => {
      await registro.expectSireciReporteGridColumnHeaders(REGISTRO_SIRECI_REPORTE_COLUMNS);
      await registro.expectSireciReporteToolbar();
      await registro.expectGridHasDataOrEmptyState();
      await registro.expectDescargarReporteDialogOpensAndCloses();
      await registro.expectSireciReporteToolbar();
    });
  });
});
