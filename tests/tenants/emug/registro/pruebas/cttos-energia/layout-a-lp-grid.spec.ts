// spec: specs/Registro/cttos-energia-dialog-buttons-playwright-test.plan.md
// seed: tests/tenants/emug/registro/cttos-energia/seed-cttos-energia.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_CTTS_ENERGIA_STANDARD_CONTRACT_COLUMNS,
  RegistroCttosEnergiaNavigationPage,
} from '../../../../../support/pages/registro/cttos-energia';

test.describe('Contratos de energía — Botones de diálogo (Path A)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroCttosEnergia);
    skipUnlessTabEnabled(MODULE_IDS.registroCttosEnergia, 'Largo plazo');
  });

  test('Layout A LP — Pie de página y desplegables del asistente Nuevo Contrato', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(180_000);
    const registro = new RegistroCttosEnergiaNavigationPage(page);

    await test.step('1. Abrir Contratos de energía desde el menú lateral y validar el shell', async () => {
      await dashboardPage.expectLoaded();
      await registro.openCttosEnergiaFromSidebar();
      await registro.expectGestorDeDatosCttosEnergiaShell();
    });

    await test.step('2. Abrir la pestaña Largo plazo y validar toolbar y columnas de la grilla', async () => {
      await registro.openContratosEnergiaTab('Largo plazo');
      await registro.expectLayoutBStandardToolbar();
      await registro.expectSelectAllColumnVisible();
      await registro.expectContractGridColumnHeaders(REGISTRO_CTTS_ENERGIA_STANDARD_CONTRACT_COLUMNS);
    });

    await test.step('3. Validar apertura y cierre del asistente Nuevo Contrato', async () => {
      await registro.expectLpNuevoContratoDialogOpensAndCloses();
    });
  });
});
