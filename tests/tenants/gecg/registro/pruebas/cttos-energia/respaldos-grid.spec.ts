// plan: specs/Registro/cttos-energia-dialog-buttons-playwright-test.plan.md
// semilla: tests/tenants/gecg/registro/pruebas/cttos-energia/seed-cttos-energia.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_CTTS_ENERGIA_LAYOUT_D_TAB,
  REGISTRO_CTTS_ENERGIA_RESPALDOS_COLUMNS,
  RegistroCttosEnergiaNavigationPage,
} from '../../../../../support/pages/registro/cttos-energia';

test.describe('Contratos de energía — Botones de diálogo (Ruta A)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroCttosEnergia);
    skipUnlessTabEnabled(MODULE_IDS.registroCttosEnergia, REGISTRO_CTTS_ENERGIA_LAYOUT_D_TAB);
  });

  test('Respaldos — Cargar Archivo', async ({ page, dashboardPage }) => {
    test.setTimeout(90_000);

    const registro = new RegistroCttosEnergiaNavigationPage(page);

    await test.step('1. Abrir Contratos Respaldos desde el menú lateral y validar el shell', async () => {
      await dashboardPage.expectLoaded();
      await registro.openCttosEnergiaFromSidebar(REGISTRO_CTTS_ENERGIA_LAYOUT_D_TAB);
      await registro.expectGestorDeDatosCttosEnergiaShell();
      await registro.expectContratosEnergiaTabActive(REGISTRO_CTTS_ENERGIA_LAYOUT_D_TAB);
    });

    await test.step('2. Validar barra de herramientas y columnas del registro', async () => {
      await registro.expectLayoutDRespaldosToolbar();
      await registro.expectContractGridColumnHeaders(REGISTRO_CTTS_ENERGIA_RESPALDOS_COLUMNS, {
        assertAcciones: false,
      });
    });

    await test.step('3. Validar apertura y cierre del diálogo Cargar Archivo', async () => {
      await registro.expectRespaldosUploadDialogOpensAndCloses();
    });
  });
});
