// spec: specs/Registro/otros-documentos-playwright-test.plan.md
// seed: tests/tenants/emug/registro/otros-documentos/seed-otros-documentos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessAllTabsEnabled, skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test, expect } from '../../../../../support/fixtures';
import {
  REGISTRO_OTROS_DOCUMENTOS_CONTADORES_VIEWS,
  RegistroOtrosDocumentosNavigationPage,
} from '../../../../../support/pages/registro/otros-documentos';

test.describe('Scenario 2 — Sidebar Navigation & Tab Cross-Over', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroOtrosDocumentos);
    skipUnlessAllTabsEnabled(
      MODULE_IDS.registroOtrosDocumentos,
      REGISTRO_OTROS_DOCUMENTOS_CONTADORES_VIEWS,
    );
  });

  test.fixme('Acceso roto a Contadores lo daña / Path B — Pair B tab cross-navigation (Contadores Frt ↔ Contadores INTI)', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(90_000);
    const registro = new RegistroOtrosDocumentosNavigationPage(page);

    // 1. Arrange: open Contadores Frt via sidebar.
    await dashboardPage.expectLoaded();
    await registro.openOtrosDocumentosFromSidebar('Contadores Frt');
    await registro.expectOtrosDocumentosViewActive('Contadores Frt');

    // 2. Act: click the Contadores INTI tab.
    await registro.openOtrosDocumentosTab('Contadores INTI');
    await expect(page.getByRole('main').getByRole('table').first()).toBeVisible();

    // 3. Act: click the Contadores Frt tab to return.
    await registro.openOtrosDocumentosTab('Contadores Frt');
    await expect(page.getByRole('tab', { name: 'Contadores Frt' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});
