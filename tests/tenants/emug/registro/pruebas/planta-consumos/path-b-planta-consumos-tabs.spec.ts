// spec: specs/Registro/planta-consumos-playwright-test.plan.md
// seed: tests/tenants/emug/registro/planta-consumos/seed-planta-consumos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessAnyTabEnabled, skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test, expect } from '../../../../../support/fixtures';
import {
  REGISTRO_PLANTA_CONSUMOS_ENABLED_TAB_NAMES,
  RegistroPlantaConsumosNavigationPage,
} from '../../../../../support/pages/registro/planta-consumos';

test.describe('Planta y consumos — Path B (in-module tab strip)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroPlantaConsumos);
    skipUnlessAnyTabEnabled(
      MODULE_IDS.registroPlantaConsumos,
      REGISTRO_PLANTA_CONSUMOS_ENABLED_TAB_NAMES,
    );
  });

  test('Path B — dashboard hover check then tab-strip navigation across all tabs', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroPlantaConsumosNavigationPage(page);

    // 1. Arrange: dashboard shell and Registro module card visible.
    await dashboardPage.expectLoaded();
    await expect(registro.registroDashboardCard()).toBeVisible();
    await expect(registro.registroDashboardCard().getByText('Empresas')).toBeVisible();
    await expect(registro.registroDashboardCard().getByText('Cttos energía')).toBeVisible();
    await expect(registro.registroDashboardCard().getByText('Cttos combustible')).toBeVisible();

    // 2. Act: hover Registro card — Insumos oferta is listed with an eye affordance (sidebar used below for tab-strip coverage).
    await registro.expectPlantaConsumosVisibleOnDashboardHover();

    // 3. Fallback entry: sidebar to Oferta Diaria default tab.
    await registro.openPlantaConsumosFromSidebar('Oferta Diaria');
    await registro.expectGestorDeDatosPlantaConsumosShell();

    // 4. Act + assert: each in-module tab selects with slug, breadcrumb, and main visible.
    for (const tabName of REGISTRO_PLANTA_CONSUMOS_ENABLED_TAB_NAMES) {
      await registro.openPlantaConsumosTab(tabName);
      await expect(page.getByRole('main')).toBeVisible();
    }
  });
});
