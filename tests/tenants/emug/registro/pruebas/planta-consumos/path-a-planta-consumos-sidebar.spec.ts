// spec: specs/Registro/planta-consumos-playwright-test.plan.md
// seed: tests/tenants/emug/registro/planta-consumos/seed-planta-consumos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessAnyTabEnabled, skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_PLANTA_CONSUMOS_ENABLED_TAB_NAMES,
  RegistroPlantaConsumosNavigationPage,
} from '../../../../../support/pages/registro/planta-consumos';

test.describe('Planta y consumos — Path A (sidebar)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroPlantaConsumos);
    skipUnlessAnyTabEnabled(
      MODULE_IDS.registroPlantaConsumos,
      REGISTRO_PLANTA_CONSUMOS_ENABLED_TAB_NAMES,
    );
  });

  test('Path A — each submodule via sidebar Registro → Insumos oferta dropdown', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(120_000);
    const registro = new RegistroPlantaConsumosNavigationPage(page);

    // 1. Arrange: authenticated dashboard shell before sidebar interaction.
    await dashboardPage.expectLoaded();

    for (const tabName of REGISTRO_PLANTA_CONSUMOS_ENABLED_TAB_NAMES) {
      // 2. Act: expand Registro → Insumos oferta and open nested sidebar link.
      await registro.openPlantaConsumosFromSidebar(tabName);

      // 3. Assert: URL slug, breadcrumb, aria-selected tab, and shell on first iteration.
      await registro.expectPlantaConsumosTabActive(tabName);
      if (tabName === REGISTRO_PLANTA_CONSUMOS_ENABLED_TAB_NAMES[0]) {
        await registro.expectGestorDeDatosPlantaConsumosShell();
      }
    }
  });
});
