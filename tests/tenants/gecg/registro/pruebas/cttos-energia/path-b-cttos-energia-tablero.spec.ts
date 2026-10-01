// plan: specs/Registro/cttos-energia-tabs-playwright-test.plan.md
// semilla: tests/tenants/gecg/registro/pruebas/cttos-energia/seed-cttos-energia.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import {
  skipUnlessAnyTabEnabled,
  skipUnlessModuleEnabled,
  whenTabEnabled,
} from '../../../../../support/config/tenant-guards';
import { expect, test } from '../../../../../support/fixtures';
import {
  REGISTRO_CTTS_ENERGIA_DEC_CONTRACT_COLUMNS,
  REGISTRO_CTTS_ENERGIA_LAYOUT_A_TAB,
  REGISTRO_CTTS_ENERGIA_LAYOUT_C_TAB,
  REGISTRO_CTTS_ENERGIA_LAYOUT_SPOT_CHECK_TABS,
  RegistroCttosEnergiaNavigationPage,
} from '../../../../../support/pages/registro/cttos-energia';

test.describe('Contratos de energía — Ruta B (tablero)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroCttosEnergia);
    skipUnlessAnyTabEnabled(MODULE_IDS.registroCttosEnergia, REGISTRO_CTTS_ENERGIA_LAYOUT_SPOT_CHECK_TABS);
  });

  test('Ruta B — Un tablero por Largo plazo y DEC', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroCttosEnergiaNavigationPage(page);

    await test.step('1. Abrir Cttos energía desde la grilla del tablero y validar el shell', async () => {
      await dashboardPage.expectLoaded();
      await registro.openCttosEnergiaFromDashboardGrid();
      await registro.expectGestorDeDatosCttosEnergiaShell();
    });

    await whenTabEnabled(
      MODULE_IDS.registroCttosEnergia,
      REGISTRO_CTTS_ENERGIA_LAYOUT_A_TAB,
      async () => {
        await registro.openContratosEnergiaTab(REGISTRO_CTTS_ENERGIA_LAYOUT_A_TAB);
        await registro.expectSelectAllColumnVisible();
      },
      '2. Largo plazo — abrir y validar la columna Select all',
    );

    await whenTabEnabled(
      MODULE_IDS.registroCttosEnergia,
      REGISTRO_CTTS_ENERGIA_LAYOUT_C_TAB,
      async () => {
        await registro.openContratosEnergiaTab(REGISTRO_CTTS_ENERGIA_LAYOUT_C_TAB);
        await registro.expectLayoutCDecToolbar();
        await registro.expectContractGridColumnHeaders(REGISTRO_CTTS_ENERGIA_DEC_CONTRACT_COLUMNS);
        const decTable = page.getByRole('main').getByRole('table').first();
        await expect(decTable.getByRole('columnheader', { name: 'Estado', exact: true })).toHaveCount(
          0,
        );
      },
      '3. DEC — abrir y validar la barra de herramientas y columnas sin Estado',
    );
  });
});
