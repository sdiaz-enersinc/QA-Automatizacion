// spec: specs/Registro/otros-documentos-playwright-test.plan.md
// seed: tests/tenants/emug/registro/pruebas/otros-documentos/seed-otros-documentos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessAllTabsEnabled, skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test } from '../../../../../support/fixtures';
import {
  REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_VIEWS,
  RegistroOtrosDocumentosNavigationPage,
} from '../../../../../support/pages/registro/otros-documentos';

test.describe('Escenario 2 — Navegación por menú lateral y cruce de pestañas', () => {
  test.beforeEach(() => {
    skipUnlessModuleEnabled(MODULE_IDS.registroOtrosDocumentos);
    skipUnlessAllTabsEnabled(
      MODULE_IDS.registroOtrosDocumentos,
      REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_VIEWS,
    );
  });

  test('Path B — Cruce de pestañas Par A (Hidrologia Horaria ↔ Hidrologia Diaria)', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(90_000);
    const registro = new RegistroOtrosDocumentosNavigationPage(page);
    const [origen, pareja] = REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_VIEWS;

    // 1. Preparar: abrir Hidrologia Horaria por menú lateral.
    await dashboardPage.expectLoaded();
    await registro.openOtrosDocumentosFromSidebar(origen);

    // 2. Actuar: pulsar la pestaña pareja y volver al origen.
    await registro.openOtrosDocumentosTab(pareja);
    await registro.expectOtrosDocumentosPairTabVisible(pareja);
    await registro.openOtrosDocumentosTab(origen);
  });
});
