import { MODULE_IDS } from '../../../../../support/config/module-registry';
import {
  skipUnlessModuleEnabled,
  skipUnlessTabEnabled,
} from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_PLANTA_CONSUMOS_DEFAULT_TAB,
  RegistroPlantaConsumosNavigationPage,
} from '../../../../../support/pages/registro/planta-consumos';

test.beforeEach(() => {
  skipUnlessModuleEnabled(MODULE_IDS.registroPlantaConsumos);
  skipUnlessTabEnabled(MODULE_IDS.registroPlantaConsumos, REGISTRO_PLANTA_CONSUMOS_DEFAULT_TAB);
});

test('Semilla — shell de Planta y consumos por menú lateral', async ({ page, dashboardPage }) => {
  const registro = new RegistroPlantaConsumosNavigationPage(page);

  await test.step('Abrir Planta y consumos y validar el shell del gestor', async () => {
    await dashboardPage.expectLoaded();
    await registro.openPlantaConsumosFromSidebar(REGISTRO_PLANTA_CONSUMOS_DEFAULT_TAB);
    await registro.expectGestorDeDatosPlantaConsumosShell();
  });
});
