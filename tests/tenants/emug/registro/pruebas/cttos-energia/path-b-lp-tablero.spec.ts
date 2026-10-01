// plan: specs/Registro/cttos-energia-tabs-playwright-test.plan.md
// semilla: tests/tenants/emug/registro/cttos-energia/seed-cttos-energia.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_CTTS_ENERGIA_LAYOUT_A_TAB,
  RegistroCttosEnergiaNavigationPage,
} from '../../../../../support/pages/registro/cttos-energia';

test.describe('Contratos de energía — Ruta B (tablero)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroCttosEnergia);
    skipUnlessTabEnabled(MODULE_IDS.registroCttosEnergia, REGISTRO_CTTS_ENERGIA_LAYOUT_A_TAB);
  });

  test('Largo plazo — Select all desde el tablero', async ({ page, dashboardPage }) => {
    const registro = new RegistroCttosEnergiaNavigationPage(page);

    await test.step('1. Abrir Cttos energía desde la grilla del tablero y validar el shell', async () => {
      await dashboardPage.expectLoaded();
      await registro.openCttosEnergiaFromDashboardGrid();
      await registro.expectGestorDeDatosCttosEnergiaShell();
    });

    await test.step('2. Abrir Largo plazo y validar la columna Select all', async () => {
      await registro.openContratosEnergiaTab(REGISTRO_CTTS_ENERGIA_LAYOUT_A_TAB);
      await registro.expectSelectAllColumnVisible();
    });
  });
});
