// plan: specs/Registro/cttos-energia-dialog-buttons-playwright-test.plan.md
// semilla: tests/tenants/emug/registro/cttos-energia/seed-cttos-energia.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_CTTS_ENERGIA_RMS_TAB,
  REGISTRO_CTTS_ENERGIA_STANDARD_CONTRACT_COLUMNS,
  RegistroCttosEnergiaNavigationPage,
} from '../../../../../support/pages/registro/cttos-energia';

test.describe('Contratos de energía — Botones de diálogo (Ruta A)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroCttosEnergia);
    skipUnlessTabEnabled(MODULE_IDS.registroCttosEnergia, REGISTRO_CTTS_ENERGIA_RMS_TAB);
  });

  test('RMS — Pie de página y desplegables del asistente Nuevo Contrato', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(240_000);
    const registro = new RegistroCttosEnergiaNavigationPage(page);

    await test.step('1. Abrir Contratos de energía desde el menú lateral y validar el shell', async () => {
      await dashboardPage.expectLoaded();
      await registro.openCttosEnergiaFromSidebar();
      await registro.expectGestorDeDatosCttosEnergiaShell();
    });

    await test.step('2. Abrir la pestaña RMS y validar la barra de herramientas y columnas de la grilla', async () => {
      await registro.openContratosEnergiaTab(REGISTRO_CTTS_ENERGIA_RMS_TAB);
      await registro.expectLayoutBStandardToolbar();
      await registro.expectContractGridColumnHeaders(REGISTRO_CTTS_ENERGIA_STANDARD_CONTRACT_COLUMNS, {
        allowSelectAll: true,
      });
    });

    await test.step('3. Validar apertura y cierre del asistente Nuevo Contrato', async () => {
      await registro.expectRmsNuevoContratoDialogOpensAndCloses();
    });
  });
});
