// semilla: tests/tenants/gecg/registro/pruebas/otros-contratos/seed-otros-contratos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { expect, test } from '../../../../../support/fixtures';
import {
  REGISTRO_OTROS_CONTRATOS_AGR_CONTRACT_COLUMNS,
  REGISTRO_OTROS_CONTRATOS_EXCEDENTES_TAB,
  RegistroOtrosContratosNavigationPage,
} from '../../../../../support/pages/registro/otros-contratos';

test.describe('Otros contratos — chips de barra integrados; Excedentes incluida', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroOtrosContratos);
    skipUnlessTabEnabled(MODULE_IDS.registroOtrosContratos, REGISTRO_OTROS_CONTRATOS_EXCEDENTES_TAB);
  });

  test('Excedentes — barra sin chips, grilla sin Producto Facturable y diálogo Nuevo Registro', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(180_000);
    const registro = new RegistroOtrosContratosNavigationPage(page);

    // 1. Desde el tablero, abrir Otros contratos por menú lateral y pulsar la pestaña Excedentes.
    await dashboardPage.expectLoaded();
    await registro.openOtrosContratosFromSidebar(REGISTRO_OTROS_CONTRATOS_EXCEDENTES_TAB);
    await registro.expectOtrosContratosTabActive(REGISTRO_OTROS_CONTRATOS_EXCEDENTES_TAB);
    await registro.expectGestorDeDatosOtrosContratosShell();
    await expect(page.getByRole('navigation')).toContainText('Contratos energia');
    await expect(page.getByRole('navigation')).toContainText('Excedentes');

    // 2. Inspeccionar la barra de herramientas de Excedentes.
    await registro.expectOtrosContratosToolbar();

    // 3. Inspeccionar la grilla de contratos Excedentes (mismas columnas que AGR).
    await registro.expectContractGridColumnHeaders(REGISTRO_OTROS_CONTRATOS_AGR_CONTRACT_COLUMNS);
    await expect(
      page.getByRole('main').getByRole('columnheader', { name: 'Producto Facturable', exact: true }),
    ).toHaveCount(0);
    await registro.expectSelectAllColumnAbsent();

    // 4. Abrir Nuevo Registro en Excedentes, validar el formulario y cerrarlo.
    await registro.expectExcedentesNuevoRegistroDialogOpensAndCloses();
  });
});
