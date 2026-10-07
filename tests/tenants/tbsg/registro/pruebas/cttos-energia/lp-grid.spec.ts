// plan: specs/Registro/tbsg-cttos-energia-playwright-test.plan.md
// semilla: tests/tenants/tbsg/registro/pruebas/cttos-energia/seed-cttos-energia.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_CTTS_ENERGIA_LAYOUT_A_TAB,
  REGISTRO_CTTS_ENERGIA_STANDARD_CONTRACT_COLUMNS,
  RegistroCttosEnergiaNavigationPage,
} from '../../../../../support/pages/registro/cttos-energia';

test.describe('Contratos de energía — Largo plazo (Ruta A)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroCttosEnergia);
    skipUnlessTabEnabled(MODULE_IDS.registroCttosEnergia, REGISTRO_CTTS_ENERGIA_LAYOUT_A_TAB);
  });

  test('LP — Grilla, filtros y asistente Nuevo Contrato', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(180_000);
    const registro = new RegistroCttosEnergiaNavigationPage(page);

    await test.step('1. Abrir Largo plazo desde el menú lateral y validar el shell', async () => {
      await dashboardPage.expectLoaded();
      await registro.openCttosEnergiaFromSidebar(REGISTRO_CTTS_ENERGIA_LAYOUT_A_TAB);
      await registro.expectGestorDeDatosCttosEnergiaShell();
    });

    await test.step('2. Validar barra de herramientas, columnas y modal Filtros', async () => {
      await registro.expectLayoutBStandardToolbar();
      await registro.expectSelectAllColumnVisible();
      await registro.expectContractGridColumnHeaders(REGISTRO_CTTS_ENERGIA_STANDARD_CONTRACT_COLUMNS, {
        allowSelectAll: true,
      });
      await registro.expectFiltrosModalOpensAndCloses();
    });

    await test.step('3. Validar apertura y cierre del asistente Nuevo Contrato', async () => {
      await registro.expectLpNuevoContratoDialogOpensAndCloses();
    });
  });
});
