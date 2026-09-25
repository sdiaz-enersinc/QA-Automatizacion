// plan: specs/Registro/otros-contratos-agr-navigation-playwright-test.plan.md
// semilla: tests/tenants/emug/registro/pruebas/otros-contratos/seed-otros-contratos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_OTROS_CONTRATOS_MISC_CONTRACT_COLUMNS,
  REGISTRO_OTROS_CONTRATOS_MISC_TAB,
  RegistroOtrosContratosNavigationPage,
} from '../../../../../support/pages/registro/otros-contratos';

test.describe('Otros contratos — layouts (chips de barra integrados; AGR incluida)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroOtrosContratos);
    skipUnlessTabEnabled(MODULE_IDS.registroOtrosContratos, REGISTRO_OTROS_CONTRATOS_MISC_TAB);
  });

  test('Layout Miscelaneos — barra sin chips, grilla MISC y diálogo Nuevo Registro', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(180_000);
    const registro = new RegistroOtrosContratosNavigationPage(page);

    // 1. Desde el tablero, abrir Miscelaneos por Registro → Otros contratos en el menú lateral.
    await dashboardPage.expectLoaded();
    await registro.openOtrosContratosFromSidebar(REGISTRO_OTROS_CONTRATOS_MISC_TAB);
    await registro.expectGestorDeDatosOtrosContratosShell();
    await registro.expectOtrosContratosTabActive(REGISTRO_OTROS_CONTRATOS_MISC_TAB);

    // 2. Inspeccionar la barra de herramientas de Miscelaneos (absorbe toolbar-chips-removed-misc).
    await registro.expectOtrosContratosToolbar();

    // 3. Inspeccionar la grilla de contratos Miscelaneos.
    await registro.expectContractGridColumnHeaders(REGISTRO_OTROS_CONTRATOS_MISC_CONTRACT_COLUMNS);
    await registro.expectSelectAllColumnAbsent();

    // 4. Abrir Nuevo Registro, validar campos y desplegables (sin pasos de wizard) y cerrar el diálogo.
    await registro.expectMiscNuevoRegistroDialogOpensAndCloses();
  });
});
