// spec: specs/Registro/planta-consumos-playwright-test.plan.md
// seed: tests/tenants/emug/registro/planta-consumos/seed-planta-consumos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessAnyTabEnabled, skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test, expect } from '../../../../../support/fixtures';
import {
  REGISTRO_PLANTA_CONSUMOS_ENABLED_TAB_NAMES,
  RegistroPlantaConsumosNavigationPage,
} from '../../../../../support/pages/registro/planta-consumos';

test.describe('Planta y consumos — Path B (tira de pestañas del módulo)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroPlantaConsumos);
    skipUnlessAnyTabEnabled(
      MODULE_IDS.registroPlantaConsumos,
      REGISTRO_PLANTA_CONSUMOS_ENABLED_TAB_NAMES,
    );
  });

  test('Path B — verificación hover del tablero y navegación por tira de pestañas en todas las pestañas', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroPlantaConsumosNavigationPage(page);

    // 1. Preparar: shell del tablero y tarjeta del módulo Registro visible.
    await dashboardPage.expectLoaded();
    await expect(registro.registroDashboardCard()).toBeVisible();
    await expect(registro.registroDashboardCard().getByText('Empresas')).toBeVisible();
    await expect(registro.registroDashboardCard().getByText('Cttos energía')).toBeVisible();
    await expect(registro.registroDashboardCard().getByText('Cttos combustible')).toBeVisible();

    // 2. Actuar: hover en tarjeta Registro — Insumos oferta aparece con icono de ojo (menú lateral usado abajo para cobertura de tira de pestañas).
    await registro.expectPlantaConsumosVisibleOnDashboardHover();

    // 3. Entrada alternativa: menú lateral a pestaña por defecto Oferta Diaria.
    await registro.openPlantaConsumosFromSidebar('Oferta Diaria');
    await registro.expectGestorDeDatosPlantaConsumosShell();

    // 4. Actuar + verificar: cada pestaña del módulo selecciona con slug, breadcrumb y main visible.
    for (const tabName of REGISTRO_PLANTA_CONSUMOS_ENABLED_TAB_NAMES) {
      await registro.openPlantaConsumosTab(tabName);
      await expect(page.getByRole('main')).toBeVisible();
    }
  });
});
