// spec: specs/Registro/otros-documentos-playwright-test.plan.md
// seed: tests/tenants/emug/registro/otros-documentos/seed-otros-documentos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessAnyTabEnabled, skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_OTROS_DOCUMENTOS_ENABLED_VIEW_NAMES,
  RegistroOtrosDocumentosNavigationPage,
} from '../../../../../support/pages/registro/otros-documentos';

test.describe('Scenario 2 — Sidebar Navigation & Tab Cross-Over', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroOtrosDocumentos);
    skipUnlessAnyTabEnabled(
      MODULE_IDS.registroOtrosDocumentos,
      REGISTRO_OTROS_DOCUMENTOS_ENABLED_VIEW_NAMES,
    );
  });

  test.fixme('Acceso roto a Contadores lo daña /Path A — each Otros documentos view reachable via sidebar nested links', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(120_000);
    const registro = new RegistroOtrosDocumentosNavigationPage(page);

    // 1. Arrange: expand sidebar Registro until Otros documentos nested flyout is visible.
    await dashboardPage.expectLoaded();
    await registro.expectOtrosDocumentosSubmenuGroupsVisible();

    for (const viewName of REGISTRO_OTROS_DOCUMENTOS_ENABLED_VIEW_NAMES) {
      // 2–5. Act + Assert: open each view via sidebar and verify URL, breadcrumb, tab, and grid.
      await registro.openOtrosDocumentosFromSidebar(viewName);
      await registro.expectOtrosDocumentosViewActive(viewName);
      await registro.expectOtrosDocumentosPairTabVisible(viewName);
    }
  });
});
