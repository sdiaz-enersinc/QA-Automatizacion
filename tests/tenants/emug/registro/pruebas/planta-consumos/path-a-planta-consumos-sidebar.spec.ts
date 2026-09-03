// spec: specs/Registro/planta-consumos-playwright-test.plan.md
// seed: tests/tenants/emug/registro/planta-consumos/seed-planta-consumos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessAnyTabEnabled, skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_PLANTA_CONSUMOS_ENABLED_TAB_NAMES,
  RegistroPlantaConsumosNavigationPage,
} from '../../../../../support/pages/registro/planta-consumos';

test.describe('Planta y consumos — Path A (menú lateral)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroPlantaConsumos);
    skipUnlessAnyTabEnabled(
      MODULE_IDS.registroPlantaConsumos,
      REGISTRO_PLANTA_CONSUMOS_ENABLED_TAB_NAMES,
    );
  });

  test('Path A — cada submódulo por menú lateral Registro → Insumos oferta', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(120_000);
    const registro = new RegistroPlantaConsumosNavigationPage(page);

    // 1. Preparar: shell del tablero autenticado antes de interactuar con el menú lateral.
    await dashboardPage.expectLoaded();

    for (const tabName of REGISTRO_PLANTA_CONSUMOS_ENABLED_TAB_NAMES) {
      // 2. Actuar: expandir Registro → Insumos oferta y abrir enlace anidado del menú lateral.
      await registro.openPlantaConsumosFromSidebar(tabName);

      // 3. Verificar: slug de URL, breadcrumb, pestaña aria-selected y shell en la primera iteración.
      await registro.expectPlantaConsumosTabActive(tabName);
      if (tabName === REGISTRO_PLANTA_CONSUMOS_ENABLED_TAB_NAMES[0]) {
        await registro.expectGestorDeDatosPlantaConsumosShell();
      }
    }
  });
});
