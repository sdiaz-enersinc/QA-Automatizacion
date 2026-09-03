// spec: specs/Registro/otros-documentos-playwright-test.plan.md
// seed: tests/tenants/emug/registro/otros-documentos/seed-otros-documentos.spec.ts

import { MODULE_IDS } from '../../../../../support/config/module-registry';
import { skipUnlessAllTabsEnabled, skipUnlessModuleEnabled } from '../../../../../support/config/tenant-guards';
import { test, expect } from '../../../../../support/fixtures';
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

    // 1. Preparar: abrir Hidrologia Horaria por menú lateral.
    await dashboardPage.expectLoaded();
    await registro.openOtrosDocumentosFromSidebar('Hidrologia Horaria');
    await registro.expectOtrosDocumentosViewActive('Hidrologia Horaria');

    // 2. Actuar: pulsar la pestaña Hidrologia Diaria.
    await registro.openOtrosDocumentosTab('Hidrologia Diaria');
    await expect(page.getByRole('main')).toBeVisible();
    await registro.expectOtrosDocumentosPairTabVisible('Hidrologia Diaria');

    // 3. Actuar: pulsar la pestaña Hidrologia Horaria para volver.
    await registro.openOtrosDocumentosTab('Hidrologia Horaria');
    await expect(page.getByRole('tab', { name: 'Hidrologia Horaria' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});
