import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_HISTORIAL_DEFAULT_TAB,
  RegistroHistorialNavigationPage,
} from '../../../../../support/pages/registro/historial';

test.beforeEach(() => {
  skipUnlessModuleEnabled(MODULE_IDS.registroHistorial);
  skipUnlessTabEnabled(MODULE_IDS.registroHistorial, REGISTRO_HISTORIAL_DEFAULT_TAB);
});

test('Seed — shell de Historial por menú lateral', async ({ page, dashboardPage }) => {
  const registro = new RegistroHistorialNavigationPage(page);

  await test.step('Abrir Historial y validar el shell del gestor', async () => {
    await dashboardPage.expectLoaded();
    await registro.openHistorialFromSidebar(REGISTRO_HISTORIAL_DEFAULT_TAB);
    await registro.expectGestorDeDatosHistorialShell();
  });
});
