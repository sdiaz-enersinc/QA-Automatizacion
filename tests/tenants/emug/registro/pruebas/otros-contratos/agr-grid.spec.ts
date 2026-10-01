// plan: specs/Registro/otros-contratos-agr-navigation-playwright-test.plan.md
// semilla: tests/tenants/emug/registro/pruebas/otros-contratos/seed-otros-contratos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { expect, test } from '../../../../../support/fixtures';
import {
  REGISTRO_OTROS_CONTRATOS_AGR_CONTRACT_COLUMNS,
  REGISTRO_OTROS_CONTRATOS_AGR_TAB,
  RegistroOtrosContratosNavigationPage,
} from '../../../../../support/pages/registro/otros-contratos';

test.describe('Otros contratos — chips de barra integrados; AGR incluida', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroOtrosContratos);
    skipUnlessTabEnabled(MODULE_IDS.registroOtrosContratos, REGISTRO_OTROS_CONTRATOS_AGR_TAB);
  });

  test('AGR — barra sin chips, grilla sin Producto Facturable y diálogo Nuevo Registro', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(180_000);
    const registro = new RegistroOtrosContratosNavigationPage(page);

    // 1. Desde el tablero, abrir Otros contratos en Miscelaneos por menú lateral y pulsar la pestaña AGR.
    await dashboardPage.expectLoaded();
    await registro.openOtrosContratosFromSidebar(REGISTRO_OTROS_CONTRATOS_AGR_TAB);
    await registro.expectOtrosContratosTabActive(REGISTRO_OTROS_CONTRATOS_AGR_TAB);
    await registro.expectGestorDeDatosOtrosContratosShell();
    await expect(page.getByRole('navigation')).toContainText('Contratos energia');
    await expect(page.getByRole('navigation')).toContainText('Agr');

    // 2. Inspeccionar la barra de herramientas de AGR (absorbe toolbar-chips-removed-agr).
    await registro.expectOtrosContratosToolbar();

    // 3. Inspeccionar la grilla de contratos AGR.
    await registro.expectContractGridColumnHeaders(REGISTRO_OTROS_CONTRATOS_AGR_CONTRACT_COLUMNS);
    await expect(
      page.getByRole('main').getByRole('columnheader', { name: 'Producto Facturable', exact: true }),
    ).toHaveCount(0);
    await registro.expectSelectAllColumnAbsent();

    // 4. Abrir Nuevo Registro en AGR, validar el formulario y cerrarlo (Escape o cancelar).
    await registro.expectAgrNuevoRegistroDialogOpensAndCloses();
  });
});
