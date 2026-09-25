import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_CTTS_COMBUSTIBLE_DEFAULT_TAB,
  RegistroCttosCombustibleNavigationPage,
} from '../../../../../support/pages/registro/cttos-combustible';

test.beforeEach(() => {
  skipUnlessModuleEnabled(MODULE_IDS.registroCttosCombustible);
  skipUnlessTabEnabled(MODULE_IDS.registroCttosCombustible, REGISTRO_CTTS_COMBUSTIBLE_DEFAULT_TAB);
});

test('Semilla — shell de Contratos combustible por menú lateral', async ({ page, dashboardPage }) => {
  const registro = new RegistroCttosCombustibleNavigationPage(page);

  await test.step('Abrir Contratos combustible y validar el shell del gestor', async () => {
    await dashboardPage.expectLoaded();
    await registro.openCttosCombustibleFromSidebar(REGISTRO_CTTS_COMBUSTIBLE_DEFAULT_TAB);
    await registro.expectGestorDeDatosCttosCombustibleShell();
  });
});
