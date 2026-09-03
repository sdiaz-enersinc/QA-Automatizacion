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

/** Aserciones opcionales de grilla por vista para la familia de layouts Contadores. */
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

test.describe('Escenario 3 — Validación de componentes e interactividad UI', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroOtrosDocumentos);
    skipUnlessAnyTabEnabled(
      MODULE_IDS.registroOtrosDocumentos,
      REGISTRO_OTROS_DOCUMENTOS_CONTADORES_VIEWS,
    );
  });

  test.fixme('Acceso roto a Contadores lo daña / Contadores — shell de grilla, filtros y diálogo Cargar archivo (Frt + INTI)', async ({
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
          // 1. Preparar: navegar a la vista por menú lateral.
          await registro.openOtrosDocumentosFromSidebar(view);
          await registro.expectOtrosDocumentosViewActive(view);
          await registro.expectOtrosDocumentosToolbar();

          // 2. Verificar estructura de tabla (columnas compartidas + extras específicos de la vista).
          await registro.expectGridColumnHeaders(REGISTRO_OTROS_DOCUMENTOS_CONTADORES_COLUMNS);
          await assertViewSpecific(registro, page);

          // 3–6. Interacciones compartidas de filtros y diálogo de carga.
          await registro.expectOtrosDocumentosSharedFilterAndUploadDialogs();
        },
        `view: ${view}`,
      );
    }
  });
});
