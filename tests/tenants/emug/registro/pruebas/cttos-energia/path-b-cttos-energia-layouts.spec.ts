// spec: specs/Registro/cttos-energia-tabs-playwright-test.plan.md
// seed: tests/tenants/emug/registro/cttos-energia/seed-cttos-energia.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import {
  skipUnlessAnyTabEnabled,
  skipUnlessModuleEnabled,
  whenTabEnabled,
} from '../../../../../support/config/tenant-guards';
import { expect, test } from '../../../../../support/fixtures';
import {
  REGISTRO_CTTS_ENERGIA_DEC_CONTRACT_COLUMNS,
  RegistroCttosEnergiaNavigationPage,
} from '../../../../../support/pages/registro/cttos-energia';

const LAYOUT_SPOT_CHECK_TABS = ['Largo plazo', 'DEC'] as const;

test.describe('Contratos de energía — Path B (tablero) — comprobación puntual de layouts', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroCttosEnergia);
    skipUnlessAnyTabEnabled(MODULE_IDS.registroCttosEnergia, LAYOUT_SPOT_CHECK_TABS);
  });

  test('Path B — Un tablero por familia de layout (Layout A LP y Layout C DEC)', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroCttosEnergiaNavigationPage(page);

    await test.step('1. Abrir Cttos energía desde la grilla del tablero y validar el shell', async () => {
      await dashboardPage.expectLoaded();
      await registro.openCttosEnergiaFromDashboardGrid();
      await registro.expectGestorDeDatosCttosEnergiaShell();
    });

    await whenTabEnabled(
      MODULE_IDS.registroCttosEnergia,
      'Largo plazo',
      async () => {
        await registro.openContratosEnergiaTab('Largo plazo');
        await registro.expectSelectAllColumnVisible();
      },
      '2. Layout A LP — abrir Largo plazo y validar la columna Select all',
    );

    await whenTabEnabled(
      MODULE_IDS.registroCttosEnergia,
      'DEC',
      async () => {
        await registro.openContratosEnergiaTab('DEC');
        await registro.expectLayoutCDecToolbar();
        const decTable = page.getByRole('main').getByRole('table').first();
        await expect(decTable.getByRole('columnheader', { name: 'Estado', exact: true })).toHaveCount(
          0,
        );
        for (const col of REGISTRO_CTTS_ENERGIA_DEC_CONTRACT_COLUMNS) {
          await expect(decTable.getByRole('columnheader', { name: col, exact: true })).toBeVisible();
        }
      },
      '3. Layout C DEC — abrir DEC y validar toolbar y columnas sin Estado',
    );
  });
});
