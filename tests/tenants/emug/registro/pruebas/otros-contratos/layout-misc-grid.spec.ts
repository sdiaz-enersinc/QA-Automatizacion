// spec: specs/Registro/otros-contratos-agr-navigation-playwright-test.plan.md
// seed: tests/tenants/emug/registro/pruebas/otros-contratos/seed-otros-contratos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_OTROS_CONTRATOS_MISC_CONTRACT_COLUMNS,
  RegistroOtrosContratosNavigationPage,
} from '../../../../../support/pages/registro/otros-contratos';

test.describe('Otros contratos — layouts (toolbar chips integrados; AGR incluida)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroOtrosContratos);
    skipUnlessTabEnabled(MODULE_IDS.registroOtrosContratos, 'Miscelaneos');
  });

  test('Layout Miscelaneos — barra sin chips, grilla MISC y diálogo Nuevo Registro', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(180_000);
    const registro = new RegistroOtrosContratosNavigationPage(page);

    // 1. Desde el dashboard, abrir Miscelaneos por Registro → Otros contratos en el menú lateral.
    await dashboardPage.expectLoaded();
    await registro.openOtrosContratosFromSidebar('Miscelaneos');
    await registro.expectGestorDeDatosOtrosContratosShell();
    await registro.expectOtrosContratosTabActive('Miscelaneos');

    // 2. Inspeccionar la barra de herramientas de Miscelaneos (absorbe toolbar-chips-removed-misc).
    await registro.expectOtrosContratosToolbar();

    // 3. Inspeccionar la grilla de contratos Miscelaneos.
    await registro.expectContractGridColumnHeaders(REGISTRO_OTROS_CONTRATOS_MISC_CONTRACT_COLUMNS);
    await registro.expectSelectAllColumnAbsent();

    // 4. Abrir Nuevo Registro, validar campos y desplegables (sin pasos de wizard) y cerrar el diálogo.
    await registro.expectMiscNuevoRegistroDialogOpensAndCloses();
  });
});
