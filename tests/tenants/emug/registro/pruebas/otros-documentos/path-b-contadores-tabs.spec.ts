// spec: specs/Registro/otros-documentos-playwright-test.plan.md
// seed: tests/tenants/emug/registro/otros-documentos/seed-otros-documentos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessAllTabsEnabled, skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test, expect } from '../../../../../support/fixtures';
import {
  REGISTRO_OTROS_DOCUMENTOS_CONTADORES_VIEWS,
  RegistroOtrosDocumentosNavigationPage,
} from '../../../../../support/pages/registro/otros-documentos';

test.describe('Escenario 2 — Navegación por menú lateral y cruce de pestañas', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroOtrosDocumentos);
    skipUnlessAllTabsEnabled(
      MODULE_IDS.registroOtrosDocumentos,
      REGISTRO_OTROS_DOCUMENTOS_CONTADORES_VIEWS,
    );
  });

  test.fixme('Acceso roto a Contadores lo daña / Path B — Cruce de pestañas Par B (Contadores Frt ↔ Contadores INTI)', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(90_000);
    const registro = new RegistroOtrosDocumentosNavigationPage(page);

    // 1. Preparar: abrir Contadores Frt por menú lateral.
    await dashboardPage.expectLoaded();
    await registro.openOtrosDocumentosFromSidebar('Contadores Frt');
    await registro.expectOtrosDocumentosViewActive('Contadores Frt');

    // 2. Actuar: pulsar la pestaña Contadores INTI.
    await registro.openOtrosDocumentosTab('Contadores INTI');
    await expect(page.getByRole('main').getByRole('table').first()).toBeVisible();

    // 3. Actuar: pulsar la pestaña Contadores Frt para volver.
    await registro.openOtrosDocumentosTab('Contadores Frt');
    await expect(page.getByRole('tab', { name: 'Contadores Frt' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});
