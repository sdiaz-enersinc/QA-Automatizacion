// plan: specs/Registro/cttos-combustible-navigation-playwright-test.plan.md
// semilla: tests/tenants/gecg/registro/pruebas/cttos-combustible/seed-cttos-combustible.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import {
  skipUnlessAnyTabEnabled,
  skipUnlessModuleEnabled,
  whenTabEnabled,
} from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_A_TAB,
  REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_B_TAB,
  REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_C_TAB,
  REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_SPOT_CHECK_TABS,
  REGISTRO_CTTS_COMBUSTIBLE_SUMINISTRO_COLUMNS,
  REGISTRO_CTTS_COMBUSTIBLE_TRANSPORTE_COLUMNS,
  RegistroCttosCombustibleNavigationPage,
} from '../../../../../support/pages/registro/cttos-combustible';

test.describe('Contratos combustible — Ruta B (tablero)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroCttosCombustible);
    skipUnlessAnyTabEnabled(MODULE_IDS.registroCttosCombustible, REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_SPOT_CHECK_TABS);
  });

  test('Ruta B — Un tablero por Transporte, Suministro e Inventarios', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroCttosCombustibleNavigationPage(page);

    await test.step('1. Abrir Cttos combustible desde la grilla del tablero y validar el shell', async () => {
      await dashboardPage.expectLoaded();
      await registro.openCttosCombustibleFromDashboardGrid();
      await registro.expectGestorDeDatosCttosCombustibleShell();
    });

    await whenTabEnabled(
      MODULE_IDS.registroCttosCombustible,
      REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_A_TAB,
      async () => {
        await registro.expectSelectAllColumnVisible();
        await registro.expectTransporteGridColumnHeaders(REGISTRO_CTTS_COMBUSTIBLE_TRANSPORTE_COLUMNS);
        await registro.expectLayoutATransporteToolbar();
      },
      '2. Transporte — validar Select all, columnas y barra',
    );

    await whenTabEnabled(
      MODULE_IDS.registroCttosCombustible,
      REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_B_TAB,
      async () => {
        await registro.openContratosCombustibleTab(REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_B_TAB);
        await registro.expectNoSelectAllColumn();
        await registro.expectSuministroGridColumnHeaders(REGISTRO_CTTS_COMBUSTIBLE_SUMINISTRO_COLUMNS);
        await registro.expectLayoutBSuministroToolbar();
      },
      '3. Suministro — validar ausencia de Select all, columnas y barra',
    );

    await whenTabEnabled(
      MODULE_IDS.registroCttosCombustible,
      REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_C_TAB,
      async () => {
        await registro.openContratosCombustibleTab(REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_C_TAB);
        await registro.expectInventariosUnavailablePage();
      },
      '4. Inventarios — validar pestaña habilitada y estado 404',
    );
  });
});
