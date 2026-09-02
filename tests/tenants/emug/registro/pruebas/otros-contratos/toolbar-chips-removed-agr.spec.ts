// spec: specs/Registro/emug-registro-toolbar-chips-removed.plan.md
// seed: tests/tenants/emug/registro/otros-contratos/seed-otros-contratos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { expect, test } from '../../../../../support/fixtures';
import {
  REGISTRO_OTROS_CONTRATOS_AGR_CONTRACT_COLUMNS,
  RegistroOtrosContratosNavigationPage,
} from '../../../../../support/pages/registro/otros-contratos';

test.describe('Otros contratos toolbar', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroOtrosContratos);
    skipUnlessTabEnabled(MODULE_IDS.registroOtrosContratos, 'AGR');
  });

  test('AGR toolbar keeps Filtros; chips gone', async ({ page, dashboardPage }) => {
    const registro = new RegistroOtrosContratosNavigationPage(page);

    // 1. From Miscelaneos, click the AGR tab.
    await dashboardPage.expectLoaded();
    await registro.openOtrosContratosFromSidebar('Miscelaneos');
    await registro.openOtrosContratosTab('AGR');
    await expect(page.getByRole('tab', { name: 'AGR' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('navigation')).toContainText('Contratos energia');
    await expect(page.getByRole('navigation')).toContainText('Agr');
    await registro.expectOtrosContratosToolbar();
    await registro.expectContractGridColumnHeaders(REGISTRO_OTROS_CONTRATOS_AGR_CONTRACT_COLUMNS);
    await expect(
      page.getByRole('main').getByRole('columnheader', { name: 'Producto Facturable', exact: true }),
    ).toHaveCount(0);
  });
});
