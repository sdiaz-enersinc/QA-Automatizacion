import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import { RegistroOtrosContratosNavigationPage } from '../../../../../support/pages/registro/otros-contratos';

test.beforeEach(() => {
  skipUnlessModuleEnabled(MODULE_IDS.registroOtrosContratos);
  skipUnlessTabEnabled(MODULE_IDS.registroOtrosContratos, 'Miscelaneos');
});

/**
 * Opens Otros contratos on Miscelaneos so generator and layout specs start from a known shell.
 */
test('seed', async ({ page, dashboardPage }) => {
  const registro = new RegistroOtrosContratosNavigationPage(page);
  await dashboardPage.expectLoaded();
  await registro.openOtrosContratosFromSidebar('Miscelaneos');
  await registro.expectGestorDeDatosOtrosContratosShell();
});
