// spec: specs/Registro/otros-documentos-playwright-test.plan.md
// seed: tests/tenants/emug/registro/otros-documentos/seed-otros-documentos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test, expect } from '../../../../../support/fixtures';
import { RegistroOtrosDocumentosNavigationPage } from '../../../../../support/pages/registro/otros-documentos';

test.describe('Escenario 1 — Acceso por hover del tablero (problema conocido)', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroOtrosDocumentos);
  });

  test('Path B — Navegación por hover del tablero de Otros documentos (marcador / test.skip)', async ({
    page,
    dashboardPage,
  }) => {
    // El acceso por hover del tablero para Otros documentos está roto desde jun 2026 (404 Configuración no encontrada).
    // Quitar skip cuando la navegación llegue a una vista por defecto válida con shell de Gestor de datos.
    test.skip(true, 'La entrada por hover del tablero a Otros documentos está rota desde jun 2026');

    const registro = new RegistroOtrosDocumentosNavigationPage(page);

    // 1. Preparar: autenticar y llegar al tablero. Verificar que la tarjeta del módulo Registro es visible.
    await dashboardPage.expectLoaded();
    await expect(registro.registroDashboardCard()).toBeVisible();
    await expect(registro.registroDashboardCard().getByText('Empresas')).toBeVisible();
    await expect(registro.registroDashboardCard().getByText('Cttos energía')).toBeVisible();
    await expect(registro.registroDashboardCard().getByText('Cttos combustible')).toBeVisible();

    // 2. Actuar: hover en la tarjeta Registro del tablero para revelar la lista extendida de submódulos.
    await registro.expectOtrosDocumentosVisibleOnDashboardHover();

    // 3. Actuar (comportamiento roto documentado): pulsar el icono de ojo de Otros documentos.
    await registro.openOtrosDocumentosFromDashboardGrid();
    await registro.expectOtrosDocumentosDashboard404();
  });
});
