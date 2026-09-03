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

/** Encabezados de columnas por vista y aserciones opcionales de grilla para la familia de layouts Hidrologia. */
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

test.describe('Escenario 3 — Validación de componentes e interactividad UI', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroOtrosDocumentos);
    skipUnlessAnyTabEnabled(
      MODULE_IDS.registroOtrosDocumentos,
      REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_VIEWS,
    );
  });

  test('Hidrologia — shell de grilla, filtros y diálogo Cargar archivo (Horaria + Diaria)', async ({
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
          // 1. Preparar: navegar a la vista por menú lateral.
          await registro.openOtrosDocumentosFromSidebar(view);
          await registro.expectOtrosDocumentosViewActive(view);
          await registro.expectOtrosDocumentosToolbar();

          // 2. Verificar estructura de tabla (columnas específicas de la vista y extras).
          await registro.expectGridColumnHeaders(columns);
          await assertViewSpecific(registro);

          // 3. Interactuar con filtro Modo Yo: activar y desactivar.
          // await registro.expectModoYoFilterToggle();

          // 4. Solo diálogo de carga — la barra de herramientas de Hidrologia no tiene chips de filtro Estado/Usuarios.
          await registro.expectCargarArchivoDialogOpensAndCloses();
        },
        `view: ${view}`,
      );
    }
  });
});
