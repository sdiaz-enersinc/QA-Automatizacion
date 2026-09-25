import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_OTROS_CONTRATOS_DEFAULT_TAB,
  RegistroOtrosContratosNavigationPage,
} from '../../../../../support/pages/registro/otros-contratos';

test.beforeEach(() => {
  skipUnlessModuleEnabled(MODULE_IDS.registroOtrosContratos);
  skipUnlessTabEnabled(MODULE_IDS.registroOtrosContratos, REGISTRO_OTROS_CONTRATOS_DEFAULT_TAB);
});

/**
 * Abre Otros contratos en Miscelaneos para que los specs de generador y layout partan de un shell conocido.
 */
test('Seed — shell de Otros contratos en Miscelaneos', async ({ page, dashboardPage }) => {
  const registro = new RegistroOtrosContratosNavigationPage(page);
  await dashboardPage.expectLoaded();
  await registro.openOtrosContratosFromSidebar(REGISTRO_OTROS_CONTRATOS_DEFAULT_TAB);
  await registro.expectGestorDeDatosOtrosContratosShell();
});
