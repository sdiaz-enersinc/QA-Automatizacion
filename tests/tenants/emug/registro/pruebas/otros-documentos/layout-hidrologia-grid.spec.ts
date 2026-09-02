// spec: specs/Registro/otros-documentos-playwright-test.plan.md
// seed: tests/tenants/emug/registro/otros-documentos/seed-otros-documentos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import {
  skipUnlessAnyTabEnabled,
  skipUnlessModuleEnabled,
  whenTabEnabled,
} from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_DIARIA_COLUMNS,
  REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_HORARIA_COLUMNS,
  REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_VIEWS,
  RegistroOtrosDocumentosNavigationPage,
  type RegistroOtrosDocumentosViewName,
} from '../../../../../support/pages/registro/otros-documentos';

/** Per-view column headers and optional grid assertions for the Hidrologia layout family. */
const HIDROLOGIA_LAYOUT_CASES: ReadonlyArray<{
  view: RegistroOtrosDocumentosViewName;
  columns: readonly string[];
  assertViewSpecific: (registro: RegistroOtrosDocumentosNavigationPage) => Promise<void>;
}> = [
  {
    view: REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_VIEWS[0],
    columns: REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_HORARIA_COLUMNS,
    assertViewSpecific: async (registro) => {
      await registro.expectGridPaginationFooter();
    },
  },
  {
    view: REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_VIEWS[1],
    columns: REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_DIARIA_COLUMNS,
    assertViewSpecific: async (registro) => {
      await registro.expectGridHasDataOrEmptyState();
    },
  },
];

test.describe('Scenario 3 — Component Validation & UI Interactivity', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroOtrosDocumentos);
    skipUnlessAnyTabEnabled(
      MODULE_IDS.registroOtrosDocumentos,
      REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_VIEWS,
    );
  });

  test('Hidrologia — grid shell, filters, and Cargar archivo dialog (Horaria + Diaria)', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(180_000);
    const registro = new RegistroOtrosDocumentosNavigationPage(page);

    await dashboardPage.expectLoaded();

    for (const { view, columns, assertViewSpecific } of HIDROLOGIA_LAYOUT_CASES) {
      await whenTabEnabled(
        MODULE_IDS.registroOtrosDocumentos,
        view,
        async () => {
          // 1. Arrange: navigate to view via sidebar.
          await registro.openOtrosDocumentosFromSidebar(view);
          await registro.expectOtrosDocumentosViewActive(view);
          await registro.expectOtrosDocumentosToolbar();

          // 2. Assert table structure (view-specific columns and extras).
          await registro.expectGridColumnHeaders(columns);
          await assertViewSpecific(registro);

          // 3. Interact with Modo Yo filter: toggle on then off.
          // await registro.expectModoYoFilterToggle();

          // 4. Upload dialog only — Hidrologia toolbar has no Estado/Usuarios filter chips.
          await registro.expectCargarArchivoDialogOpensAndCloses();
        },
        `view: ${view}`,
      );
    }
  });
});
