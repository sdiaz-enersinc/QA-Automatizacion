// spec: specs/Registro/emug-registro-restructure-playwright-test.plan.md
// seed: tests/tenants/emug/registro/otros-contratos/seed-otros-contratos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { expect, test } from '../../../../../support/fixtures';
import {
  REGISTRO_OTROS_CONTRATOS_MISC_CONTRACT_COLUMNS,
  RegistroOtrosContratosNavigationPage,
} from '../../../../../support/pages/registro/otros-contratos';

test.describe('Otros contratos — grilla Miscelaneos', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroOtrosContratos);
    skipUnlessTabEnabled(MODULE_IDS.registroOtrosContratos, 'Miscelaneos');
  });

  test('Layout B MISC — pie de página simplificado de Nuevo Registro y desplegables', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(180_000);
    const registro = new RegistroOtrosContratosNavigationPage(page);

    await dashboardPage.expectLoaded();
    await registro.openOtrosContratosFromSidebar('Miscelaneos');
    await registro.expectGestorDeDatosOtrosContratosShell();

    // 1. Pestaña Miscelaneos: columnas específicas de MISC, CTA Nuevo Registro (no Nuevo Contrato).
    await registro.expectOtrosContratosTabActive('Miscelaneos');
    await registro.expectContractGridColumnHeaders(REGISTRO_OTROS_CONTRATOS_MISC_CONTRACT_COLUMNS);
    await expect(
      page.getByRole('main').getByRole('table').first().getByRole('columnheader', { name: 'Select all' }),
    ).toHaveCount(0);

    await registro.expectOtrosContratosToolbar();

    // 2. Campos y desplegables del diálogo Nuevo Registro (sin pasos de wizard).
    await registro.expectMiscNuevoRegistroDialogOpensAndCloses();
  });
});
