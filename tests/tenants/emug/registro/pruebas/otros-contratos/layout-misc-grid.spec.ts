// spec: specs/Registro/emug-registro-restructure-playwright-test.plan.md
// seed: tests/tenants/emug/registro/otros-contratos/seed-otros-contratos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { expect, test } from '../../../../../support/fixtures';
import {
  REGISTRO_OTROS_CONTRATOS_MISC_CONTRACT_COLUMNS,
  RegistroOtrosContratosNavigationPage,
} from '../../../../../support/pages/registro/otros-contratos';

test.describe('Otros contratos — Miscelaneos grid', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroOtrosContratos);
    skipUnlessTabEnabled(MODULE_IDS.registroOtrosContratos, 'Miscelaneos');
  });

  test('Layout B MISC — Nuevo Registro simplified footer and dropdowns', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(180_000);
    const registro = new RegistroOtrosContratosNavigationPage(page);

    await dashboardPage.expectLoaded();
    await registro.openOtrosContratosFromSidebar('Miscelaneos');
    await registro.expectGestorDeDatosOtrosContratosShell();

    // 1. Miscelaneos tab: MISC-specific columns, Nuevo Registro CTA (not Nuevo Contrato).
    await registro.expectOtrosContratosTabActive('Miscelaneos');
    await registro.expectContractGridColumnHeaders(REGISTRO_OTROS_CONTRATOS_MISC_CONTRACT_COLUMNS);
    await expect(
      page.getByRole('main').getByRole('table').first().getByRole('columnheader', { name: 'Select all' }),
    ).toHaveCount(0);

    await registro.expectOtrosContratosToolbar();

    // 2. Nuevo Registro dialog fields and dropdowns (no wizard steps).
    await registro.expectMiscNuevoRegistroDialogOpensAndCloses();
  });
});
