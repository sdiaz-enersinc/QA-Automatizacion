// spec: specs/Registro/emug-registro-toolbar-chips-removed.plan.md
// seed: tests/tenants/emug/registro/pruebas/cttos-energia/seed-cttos-energia.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled, skipUnlessTabEnabled } from '../../../../../support/config/tenant-guards';
import { expect, test } from '../../../../../support/fixtures';
import {
  REGISTRO_CTTS_ENERGIA_DEFAULT_TAB,
  REGISTRO_CTTS_ENERGIA_LOCKED_TAB_NAMES,
  REGISTRO_CTTS_ENERGIA_TOOLBAR_CHIP_LOOKALIKE_COLUMNS,
  RegistroCttosEnergiaNavigationPage,
} from '../../../../../support/pages/registro/cttos-energia';

test.describe('Cobertura negativa y helpers compartidos', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroCttosEnergia);
    skipUnlessTabEnabled(MODULE_IDS.registroCttosEnergia, REGISTRO_CTTS_ENERGIA_DEFAULT_TAB);
  });

  test('Los localizadores de chips de la barra de herramientas no deben coincidir con columnas de grilla ni Usuarios NR', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroCttosEnergiaNavigationPage(page);

    // 1. En Largo plazo, consultar la región de la barra de herramientas, no la tabla principal completa.
    await dashboardPage.expectLoaded();
    await registro.openCttosEnergiaFromSidebar(REGISTRO_CTTS_ENERGIA_DEFAULT_TAB);
    await registro.expectGestorDeDatosCttosEnergiaShell();
    await registro.expectContratosEnergiaTabActive(REGISTRO_CTTS_ENERGIA_DEFAULT_TAB);
    await registro.expectFiltrosControlVisible();
    await registro.expectToolbarFilterChipsAbsent();
    for (const tabName of REGISTRO_CTTS_ENERGIA_LOCKED_TAB_NAMES) {
      await expect(page.getByRole('tab', { name: tabName, exact: true })).toBeVisible();
      await expect(page.getByRole('tab', { name: tabName, exact: true })).toBeDisabled();
    }
    const table = page.getByRole('main').getByRole('table').first();
    for (const columnName of REGISTRO_CTTS_ENERGIA_TOOLBAR_CHIP_LOOKALIKE_COLUMNS) {
      await expect(table.getByRole('columnheader', { name: columnName, exact: true })).toBeVisible();
    }
  });
});
