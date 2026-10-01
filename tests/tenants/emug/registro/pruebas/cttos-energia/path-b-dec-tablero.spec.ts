// plan: specs/Registro/cttos-energia-tabs-playwright-test.plan.md
// semilla: tests/tenants/emug/registro/cttos-energia/seed-cttos-energia.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { expect, test } from '../../../../../support/fixtures';
import {
  REGISTRO_CTTS_ENERGIA_DEC_CONTRACT_COLUMNS,
  REGISTRO_CTTS_ENERGIA_LAYOUT_C_TAB,
  RegistroCttosEnergiaNavigationPage,
} from '../../../../../support/pages/registro/cttos-energia';

test.describe('Contratos de energía — Ruta B (tablero)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroCttosEnergia);
    skipUnlessTabEnabled(MODULE_IDS.registroCttosEnergia, REGISTRO_CTTS_ENERGIA_LAYOUT_C_TAB);
  });

  test('DEC — barra y columnas sin Estado desde el tablero', async ({ page, dashboardPage }) => {
    const registro = new RegistroCttosEnergiaNavigationPage(page);

    await test.step('1. Abrir Cttos energía desde la grilla del tablero y validar el shell', async () => {
      await dashboardPage.expectLoaded();
      await registro.openCttosEnergiaFromDashboardGrid();
      await registro.expectGestorDeDatosCttosEnergiaShell();
    });

    await test.step('2. Abrir DEC y validar la barra de herramientas y columnas sin Estado', async () => {
      await registro.openContratosEnergiaTab(REGISTRO_CTTS_ENERGIA_LAYOUT_C_TAB);
      await registro.expectLayoutCDecToolbar();
      await registro.expectContractGridColumnHeaders(REGISTRO_CTTS_ENERGIA_DEC_CONTRACT_COLUMNS);
      const decTable = page.getByRole('main').getByRole('table').first();
      await expect(decTable.getByRole('columnheader', { name: 'Estado', exact: true })).toHaveCount(0);
    });
  });
});
