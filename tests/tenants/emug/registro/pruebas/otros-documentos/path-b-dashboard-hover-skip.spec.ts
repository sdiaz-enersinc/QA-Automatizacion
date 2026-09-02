// spec: specs/Registro/otros-documentos-playwright-test.plan.md
// seed: tests/tenants/emug/registro/otros-documentos/seed-otros-documentos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test, expect } from '../../../../../support/fixtures';
import { RegistroOtrosDocumentosNavigationPage } from '../../../../../support/pages/registro/otros-documentos';

test.describe('Scenario 1 — Dashboard Hover Access (Known Issue)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroOtrosDocumentos);
  });

  test('Path B — Otros documentos dashboard hover navigation (placeholder / test.skip)', async ({
    page,
    dashboardPage,
  }) => {
    // Dashboard hover entry for Otros documentos is broken as of Jun 2026 (404 Configuración no encontrada).
    // Remove skip when navigation lands on a valid default view with Gestor de datos shell.
    test.skip(true, 'Dashboard hover entry for Otros documentos is broken as of Jun 2026');

    const registro = new RegistroOtrosDocumentosNavigationPage(page);

    // 1. Arrange: authenticate and land on the dashboard. Assert the Registro module card is visible.
    await dashboardPage.expectLoaded();
    await expect(registro.registroDashboardCard()).toBeVisible();
    await expect(registro.registroDashboardCard().getByText('Empresas')).toBeVisible();
    await expect(registro.registroDashboardCard().getByText('Cttos energía')).toBeVisible();
    await expect(registro.registroDashboardCard().getByText('Cttos combustible')).toBeVisible();

    // 2. Act: hover the Registro dashboard card to reveal extended submodule list.
    await registro.expectOtrosDocumentosVisibleOnDashboardHover();

    // 3. Act (documented broken behaviour): click the Otros documentos eye icon.
    await registro.openOtrosDocumentosFromDashboardGrid();
    await registro.expectOtrosDocumentosDashboard404();
  });
});
