// plan: specs/Registro/tbsg-cttos-combustible-playwright-test.plan.md
// semilla: tests/tenants/tbsg/registro/pruebas/cttos-combustible/seed-cttos-combustible.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_B_TAB,
  REGISTRO_CTTS_COMBUSTIBLE_SUMINISTRO_COLUMNS,
  RegistroCttosCombustibleNavigationPage,
} from '../../../../../support/pages/registro/cttos-combustible';

test.describe('Contratos combustible — Suministro (Ruta A)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroCttosCombustible);
    skipUnlessTabEnabled(MODULE_IDS.registroCttosCombustible, REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_B_TAB);
  });

  test('Suministro — Grilla, filtros y diálogo Nuevo Registro', async ({ page, dashboardPage }) => {
    test.setTimeout(300_000);
    const registro = new RegistroCttosCombustibleNavigationPage(page);

    await test.step('1. Abrir Suministro desde el menú lateral y validar la pestaña activa', async () => {
      await dashboardPage.expectLoaded();
      await registro.openCttosCombustibleFromSidebar(REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_B_TAB);
      await registro.expectContratosCombustibleTabActive(REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_B_TAB);
    });

    await test.step('2. Validar barra de herramientas, columnas y modal Filtros', async () => {
      await registro.expectLayoutBSuministroToolbar();
      await registro.expectNoSelectAllColumn();
      await registro.expectSuministroGridColumnHeaders(REGISTRO_CTTS_COMBUSTIBLE_SUMINISTRO_COLUMNS);
      await registro.expectFiltrosModalOpensAndCloses();
    });

    await test.step('3. Validar apertura y cierre del asistente Nuevo Registro', async () => {
      await registro.expectSuministroNuevoRegistroDialogOpensAndCloses();
    });
  });
});
