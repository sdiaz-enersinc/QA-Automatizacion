// spec: specs/Registro/otros-documentos-playwright-test.plan.md
// seed: tests/tenants/emug/registro/otros-documentos/seed-otros-documentos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import {
  skipUnlessAnyTabEnabled,
  skipUnlessModuleEnabled,
  whenTabEnabled,
} from '../../../../../support/config/tenant-guards';
import { test, expect } from '../../../../../support/fixtures';
import type { Page } from '@playwright/test';
import {
  REGISTRO_OTROS_DOCUMENTOS_CONTADORES_COLUMNS,
  REGISTRO_OTROS_DOCUMENTOS_CONTADORES_VIEWS,
  RegistroOtrosDocumentosNavigationPage,
  type RegistroOtrosDocumentosViewName,
} from '../../../../../support/pages/registro/otros-documentos';

/** Per-view optional grid assertions for the Contadores layout family. */
const CONTADORES_LAYOUT_CASES: ReadonlyArray<{
  view: RegistroOtrosDocumentosViewName;
  assertViewSpecific: (
    registro: RegistroOtrosDocumentosNavigationPage,
    page: Page,
  ) => Promise<void>;
}> = [
  {
    view: REGISTRO_OTROS_DOCUMENTOS_CONTADORES_VIEWS[0],
    assertViewSpecific: async (registro, page) => {
      await expect(page.getByRole('tab', { name: 'Contadores INTI' })).toBeVisible();
      await registro.expectContadoresFrtSampleRows();
    },
  },
  {
    view: REGISTRO_OTROS_DOCUMENTOS_CONTADORES_VIEWS[1],
    assertViewSpecific: async (registro, page) => {
      await expect(page).toHaveURL(/contadores-inti/);
      await registro.expectNoErrorBanner();
    },
  },
];

test.describe('Scenario 3 — Component Validation & UI Interactivity', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroOtrosDocumentos);
    skipUnlessAnyTabEnabled(
      MODULE_IDS.registroOtrosDocumentos,
      REGISTRO_OTROS_DOCUMENTOS_CONTADORES_VIEWS,
    );
  });

  test.fixme('Acceso roto a Contadores lo daña / Contadores — grid shell, filters, and Cargar archivo dialog (Frt + INTI)', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(180_000);
    const registro = new RegistroOtrosDocumentosNavigationPage(page);

    await dashboardPage.expectLoaded();

    for (const { view, assertViewSpecific } of CONTADORES_LAYOUT_CASES) {
      await whenTabEnabled(
        MODULE_IDS.registroOtrosDocumentos,
        view,
        async () => {
          // 1. Arrange: navigate to view via sidebar.
          await registro.openOtrosDocumentosFromSidebar(view);
          await registro.expectOtrosDocumentosViewActive(view);
          await registro.expectOtrosDocumentosToolbar();

          // 2. Assert table structure (shared columns + view-specific extras).
          await registro.expectGridColumnHeaders(REGISTRO_OTROS_DOCUMENTOS_CONTADORES_COLUMNS);
          await assertViewSpecific(registro, page);

          // 3–6. Shared filter and upload dialog interactions.
          await registro.expectOtrosDocumentosSharedFilterAndUploadDialogs();
        },
        `view: ${view}`,
      );
    }
  });
});
