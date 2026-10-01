// plan: specs/Registro/cttos-combustible-navigation-playwright-test.plan.md
// semilla: tests/tenants/gecg/registro/pruebas/cttos-combustible/seed-cttos-combustible.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_A_TAB,
  REGISTRO_CTTS_COMBUSTIBLE_TRANSPORTE_COLUMNS,
  RegistroCttosCombustibleNavigationPage,
} from '../../../../../support/pages/registro/cttos-combustible';

test.describe('Contratos combustible — Transporte (Ruta A)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroCttosCombustible);
    skipUnlessTabEnabled(MODULE_IDS.registroCttosCombustible, REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_A_TAB);
  });

  test('Transporte — Grilla, filtros, Carga Ramales y diálogo Nuevo Registro', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(180_000);
    const registro = new RegistroCttosCombustibleNavigationPage(page);

    await test.step('1. Abrir Transporte desde el menú lateral y validar el shell', async () => {
      await dashboardPage.expectLoaded();
      await registro.openCttosCombustibleFromSidebar(REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_A_TAB);
      await registro.expectGestorDeDatosCttosCombustibleShell();
    });

    await test.step('2. Validar barra de herramientas, columnas y modal Filtros', async () => {
      await registro.expectLayoutATransporteToolbar();
      await registro.expectSelectAllColumnVisible();
      await registro.expectTransporteGridColumnHeaders(REGISTRO_CTTS_COMBUSTIBLE_TRANSPORTE_COLUMNS);
      await registro.expectFiltrosModalOpensAndCloses();
    });

    await test.step('3. Validar apertura y cierre del asistente Nuevo Registro', async () => {
      await registro.expectTransporteNuevoRegistroDialogOpensAndCloses();
    });

    await test.step('4. Validar apertura y cierre del diálogo Carga Ramales', async () => {
      await registro.expectCargaRamalesDialogOpensAndCloses();
    });
  });
});
