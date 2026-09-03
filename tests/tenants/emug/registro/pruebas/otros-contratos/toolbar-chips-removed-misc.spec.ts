// spec: specs/Registro/emug-registro-toolbar-chips-removed.plan.md
// seed: tests/tenants/emug/registro/otros-contratos/seed-otros-contratos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { expect, test } from '../../../../../support/fixtures';
import {
  REGISTRO_OTROS_CONTRATOS_LOCKED_TAB_NAMES,
  REGISTRO_OTROS_CONTRATOS_MISC_CONTRACT_COLUMNS,
  RegistroOtrosContratosNavigationPage,
} from '../../../../../support/pages/registro/otros-contratos';

test.describe('Otros contratos — barra de herramientas', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroOtrosContratos);
    skipUnlessTabEnabled(MODULE_IDS.registroOtrosContratos, 'Miscelaneos');
  });

  test('Miscelaneos mantiene Filtros; chips eliminados', async ({ page, dashboardPage }) => {
    const registro = new RegistroOtrosContratosNavigationPage(page);

    // 1. Abrir Otros contratos Miscelaneos.
    await dashboardPage.expectLoaded();
    await registro.openOtrosContratosFromSidebar('Miscelaneos');
    await registro.expectGestorDeDatosOtrosContratosShell();
    await registro.expectOtrosContratosTabActive('Miscelaneos');
    await expect(page.getByRole('tab', { name: 'AGR' })).toBeEnabled();
    for (const tabName of REGISTRO_OTROS_CONTRATOS_LOCKED_TAB_NAMES) {
      await expect(page.getByRole('tab', { name: tabName })).toBeDisabled();
    }
    await expect(page.getByRole('navigation')).toContainText('Gestor de datos');
    await expect(page.getByRole('navigation')).toContainText('Otros contratos');
    await expect(page.getByRole('navigation')).toContainText('Miscelaneos');
    await registro.expectOtrosContratosToolbar();
    await registro.expectContractGridColumnHeaders(REGISTRO_OTROS_CONTRATOS_MISC_CONTRACT_COLUMNS);
  });
});
