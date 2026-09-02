// spec: specs/Registro/emug-registro-restructure-playwright-test.plan.md
// seed: tests/tenants/emug/registro/planta-consumos/seed-planta-consumos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { expect, test } from '../../../../../support/fixtures';
import {
  REGISTRO_OTROS_CONTRATOS_AGR_CONTRACT_COLUMNS,
  REGISTRO_OTROS_CONTRATOS_MISC_CONTRACT_COLUMNS,
  RegistroOtrosContratosNavigationPage,
} from '../../../../../support/pages/registro/otros-contratos';

test.describe('Otros contratos discovery', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroOtrosContratos);
  });

  test('Otros contratos sidebar and tab strip host Miscelaneos, AGR, Excedentes, Respaldos ORI', async ({
    page,
    dashboardPage,
  }) => {
    const registro = new RegistroOtrosContratosNavigationPage(page);
    const main = page.getByRole('main');

    // 1. Expand Registro then Otros contratos in the sidebar.
    await dashboardPage.expectLoaded();
    await registro.expandOtrosContratosSidebar();
    const submenu = page.getByRole('complementary').first().getByRole('menu').nth(1);
    await expect(submenu.getByRole('link', { name: 'Miscelaneos' })).toHaveAttribute(
      'href',
      '/gestor-de-datos/otros-contratos/miscelaneos',
    );
    await expect(submenu.getByRole('menuitem', { name: 'AGR' })).toBeVisible();
    await expect(submenu.getByRole('menuitem', { name: 'Excedentes', disabled: true })).toBeVisible();
    await expect(submenu.getByRole('menuitem', { name: 'Respaldos ORI', disabled: true })).toBeVisible();
    await expect(submenu.getByRole('link', { name: 'Contratos MISC', exact: true })).toHaveCount(0);

    // 2. Open Miscelaneos.
    await registro.openOtrosContratosFromSidebar('Miscelaneos');
    await registro.expectGestorDeDatosOtrosContratosShell();
    await registro.expectOtrosContratosTabActive('Miscelaneos');
    await expect(page.getByRole('navigation')).toContainText('Otros contratos');
    await expect(main.getByRole('searchbox', { name: /Buscar/i })).toBeVisible();
    await expect(main.getByText('Filtros', { exact: true })).toBeVisible();
    await expect(main.getByRole('button', { name: 'Nuevo Registro' })).toBeVisible();
    await expect(main.getByRole('button', { name: 'Nuevo Contrato' })).toHaveCount(0);
    await registro.expectToolbarFilterChipsAbsent();
    await registro.expectContractGridColumnHeaders(REGISTRO_OTROS_CONTRATOS_MISC_CONTRACT_COLUMNS);

    // 3. Open AGR from the tab strip.
    await registro.openOtrosContratosTab('AGR');
    await expect(page).toHaveURL(/gestor-de-datos\/contratos-energia\/agr/);
    await expect(page.getByRole('navigation')).toContainText('Contratos energia');
    await expect(page.getByRole('navigation')).toContainText('Agr');
    await expect(main.getByRole('button', { name: 'Nuevo Registro' })).toBeVisible();
    await registro.expectContractGridColumnHeaders(REGISTRO_OTROS_CONTRATOS_AGR_CONTRACT_COLUMNS);
    await expect(
      main.getByRole('columnheader', { name: 'Producto Facturable', exact: true }),
    ).toHaveCount(0);

    // 4. Confirm locked tabs Excedentes and Respaldos ORI are visible and disabled; do not force-navigate.
    await expect(page.getByRole('tab', { name: 'Excedentes' })).toBeDisabled();
    await expect(page.getByRole('tab', { name: 'Respaldos ORI' })).toBeDisabled();
  });
});
