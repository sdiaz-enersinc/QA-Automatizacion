// plan: specs/Registro/planta-consumos-playwright-test.plan.md
// semilla: tests/tenants/tbsg/registro/pruebas/planta-consumos/seed-planta-consumos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test, expect } from '../../../../../support/fixtures';
import { REGISTRO_NAVIGATION_DASHBOARD_PREVIEW_LABELS } from '../../../../../support/pages/registro/navigation';
import {
  REGISTRO_PLANTA_CONSUMOS_ENABLED_TAB_NAMES,
  RegistroPlantaConsumosNavigationPage,
} from '../../../../../support/pages/registro/planta-consumos';

test.describe('Planta y consumos — Ruta B (hover del tablero)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroPlantaConsumos);
  });

  test('Ruta B — El hover del tablero abre Planta y consumos y recorre las pestañas habilitadas', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroPlantaConsumosNavigationPage(page);

    await test.step('1. Validar el shell del tablero y la tarjeta de Registro', async () => {
      await dashboardPage.expectLoaded();
      await expect(registro.registroDashboardCard()).toBeVisible();
      for (const label of REGISTRO_NAVIGATION_DASHBOARD_PREVIEW_LABELS) {
        await expect(registro.registroDashboardCard().getByText(label)).toBeVisible();
      }
    });

    await test.step('2. Abrir Planta y consumos desde el hover de la tarjeta Registro', async () => {
      await registro.expectPlantaConsumosVisibleOnDashboardHover();
      await registro.openPlantaConsumosFromDashboardGrid();
    });

    await test.step('3. Validar el shell del gestor de Planta y consumos', async () => {
      await registro.expectGestorDeDatosPlantaConsumosShell();
    });

    for (const tabName of REGISTRO_PLANTA_CONSUMOS_ENABLED_TAB_NAMES) {
      await test.step(`Abrir la pestaña «${tabName}» y validar el contenido principal`, async () => {
        await registro.openPlantaConsumosTab(tabName);
        await expect(page.getByRole('main')).toBeVisible();
      });
    }
  });
});
