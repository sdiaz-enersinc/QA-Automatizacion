// spec: specs/Registro/otros-documentos-playwright-test.plan.md
// seed: tests/tenants/emug/registro/pruebas/otros-documentos/seed-otros-documentos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
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

    // 1. Preparar: autenticar y llegar al tablero. Hover y pulsar el icono de ojo.
    await dashboardPage.expectLoaded();
    await registro.openOtrosDocumentosFromDashboardHover();

    // 2. Verificar el 404 conocido en la raíz de Otros documentos.
    await registro.expectOtrosDocumentosDashboard404();
  });
});
