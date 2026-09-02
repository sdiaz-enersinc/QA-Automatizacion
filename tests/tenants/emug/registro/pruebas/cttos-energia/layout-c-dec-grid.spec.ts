// spec: specs/Registro/cttos-energia-dialog-buttons-playwright-test.plan.md
// seed: tests/tenants/emug/registro/cttos-energia/seed-cttos-energia.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { expect, test } from '../../../../../support/fixtures';
import {
  REGISTRO_CTTS_ENERGIA_DEC_CONTRACT_COLUMNS,
  RegistroCttosEnergiaNavigationPage,
} from '../../../../../support/pages/registro/cttos-energia';

test.describe('Contratos de energía — Botones de diálogo (Path A)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroCttosEnergia);
    skipUnlessTabEnabled(MODULE_IDS.registroCttosEnergia, 'DEC');
  });

  test('Layout C — DEC Nuevon contrato y Cargar archivos', async ({ page, dashboardPage }) => {
    test.setTimeout(240_000);

    const registro = new RegistroCttosEnergiaNavigationPage(page);

    await test.step('1. Abrir DEC desde el menú lateral y validar el shell', async () => {
      await dashboardPage.expectLoaded();
      await registro.openCttosEnergiaFromSidebar('DEC');
      await registro.expectGestorDeDatosCttosEnergiaShell();
      await registro.expectContratosEnergiaTabActive('DEC');
    });

    await test.step('2. Validar toolbar de DEC, CTAs duales y columnas de la grilla sin Estado', async () => {
      await registro.expectLayoutCDecToolbar();
      await registro.expectContractGridColumnHeaders(REGISTRO_CTTS_ENERGIA_DEC_CONTRACT_COLUMNS);
      const table = page.getByRole('main').getByRole('table').first();
      await expect(table.getByRole('columnheader', { name: 'Estado', exact: true })).toHaveCount(0);
    });

    await test.step('3. Validar apertura y cierre del asistente Nuevon contrato', async () => {
      await registro.expectDecNuevonContratoDialogOpensAndCloses();
    });

    await test.step('4. Validar apertura y cierre del diálogo Cargar archivos', async () => {
      await registro.expectDecUploadDialogOpensAndCloses();
    });
  });
});
