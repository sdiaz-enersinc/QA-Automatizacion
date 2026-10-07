import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_RPM_DEFAULT_TAB,
  RegistroRpmNavigationPage,
} from '../../../../../support/pages/registro/rpm';

test.beforeEach(() => {
  skipUnlessModuleEnabled(MODULE_IDS.registroRpm);
  skipUnlessTabEnabled(MODULE_IDS.registroRpm, REGISTRO_RPM_DEFAULT_TAB);
});

test('Semilla — shell de RPM por menú lateral', async ({ page, dashboardPage }) => {
  const registro = new RegistroRpmNavigationPage(page);

  await test.step('Abrir RPM XML y validar el shell del gestor', async () => {
    await dashboardPage.expectLoaded();
    await registro.openRpmFromSidebar(REGISTRO_RPM_DEFAULT_TAB);
    await registro.expectGestorDeDatosRpmShell();
  });
});
