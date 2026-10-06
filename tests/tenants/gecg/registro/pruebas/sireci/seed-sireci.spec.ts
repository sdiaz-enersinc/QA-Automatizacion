import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_SIRECI_DEFAULT_TAB,
  RegistroSireciNavigationPage,
} from '../../../../../support/pages/registro/sireci';

test.beforeEach(() => {
  skipUnlessModuleEnabled(MODULE_IDS.registroSireci);
  skipUnlessTabEnabled(MODULE_IDS.registroSireci, REGISTRO_SIRECI_DEFAULT_TAB);
});

test('Semilla — shell de Sireci por menú lateral', async ({ page, dashboardPage }) => {
  const registro = new RegistroSireciNavigationPage(page);

  await test.step('Abrir Sireci Resumen y validar el shell del gestor', async () => {
    await dashboardPage.expectLoaded();
    await registro.openSireciFromSidebar(REGISTRO_SIRECI_DEFAULT_TAB);
    await registro.expectGestorDeDatosSireciShell();
  });
});
