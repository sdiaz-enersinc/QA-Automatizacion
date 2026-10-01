// plan: specs/Registro/cttos-energia-dialog-buttons-playwright-test.plan.md
// semilla: tests/tenants/gecg/registro/pruebas/cttos-energia/seed-cttos-energia.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_CTTS_ENERGIA_LAYOUT_MISC_TAB,
  REGISTRO_CTTS_ENERGIA_MISC_CONTRACT_COLUMNS,
  RegistroCttosEnergiaNavigationPage,
} from '../../../../../support/pages/registro/cttos-energia';

test.describe('Contratos de energía — Botones de diálogo (Ruta A)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroCttosEnergia);
    skipUnlessTabEnabled(MODULE_IDS.registroCttosEnergia, REGISTRO_CTTS_ENERGIA_LAYOUT_MISC_TAB);
  });

  test('MISC — Pie simplificado y desplegables de Nuevo Registro', async ({
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

    await test.step('2. Abrir Contratos MISC y validar columnas, CTA Nuevo Registro y modal Filtros', async () => {
      await registro.openContratosEnergiaTab(REGISTRO_CTTS_ENERGIA_LAYOUT_MISC_TAB);
      await registro.expectContractGridColumnHeaders(REGISTRO_CTTS_ENERGIA_MISC_CONTRACT_COLUMNS);
      await registro.expectNoSelectAllColumn();
      await registro.expectFiltrosControlVisible();
      await registro.expectToolbarFilterChipsAbsent();
      await registro.expectFiltrosModalOpensAndCloses();
    });

    await test.step('3. Validar apertura y cierre del diálogo Nuevo Registro', async () => {
      await registro.expectMiscNuevoRegistroDialogOpensAndCloses();
    });
  });
});
