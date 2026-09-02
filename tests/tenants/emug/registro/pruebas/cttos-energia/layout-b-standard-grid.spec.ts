// spec: specs/Registro/cttos-energia-dialog-buttons-playwright-test.plan.md
// seed: tests/tenants/emug/registro/cttos-energia/seed-cttos-energia.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_CTTS_ENERGIA_LAYOUT_B_STANDARD_TABS,
  REGISTRO_CTTS_ENERGIA_STANDARD_CONTRACT_COLUMNS,
  RegistroCttosEnergiaNavigationPage,
} from '../../../../../support/pages/registro/cttos-energia';

test.describe('Contratos de energía — Botones de diálogo (Path A)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroCttosEnergia);
  });

  for (const tabName of REGISTRO_CTTS_ENERGIA_LAYOUT_B_STANDARD_TABS) {
    test(`Layout B standard — Pie de página y desplegables del asistente Nuevo Contrato en ${tabName}`, async ({
      page,
      dashboardPage,
    }) => {
      skipUnlessTabEnabled(MODULE_IDS.registroCttosEnergia, tabName);

      test.setTimeout(240_000);
      const registro = new RegistroCttosEnergiaNavigationPage(page);

      await test.step('1. Abrir Contratos de energía desde el menú lateral y validar el shell', async () => {
        await dashboardPage.expectLoaded();
        await registro.openCttosEnergiaFromSidebar();
        await registro.expectGestorDeDatosCttosEnergiaShell();
      });

      await test.step(`2. Abrir la pestaña ${tabName} y validar toolbar y columnas de la grilla`, async () => {
        await registro.openContratosEnergiaTab(tabName);
        await registro.expectLayoutBStandardToolbar();
        await registro.expectContractGridColumnHeaders(REGISTRO_CTTS_ENERGIA_STANDARD_CONTRACT_COLUMNS, {
          allowSelectAll: true,
        });
      });

      await test.step(`3. Validar apertura y cierre del asistente Nuevo Contrato en ${tabName}`, async () => {
        await registro.expectStandardTabNuevoContratoDialogOpensAndCloses(tabName);
      });
    });
  }
});
