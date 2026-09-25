import { test } from '../tests/support/fixtures';
import { runRefreshDropdownOptions } from './refresh-dropdown-options';

/**
 * Runner de mantenimiento: recaptura opciones de combobox desde QA hacia el JSON del tenant.
 * No forma parte de la suite por defecto (testMatch solo incluye specs de tenant).
 *
 * Env: REFRESH_DROPDOWNS_WRITE=1 para persistir, REFRESH_DROPDOWNS_MODULE=<id> para filtrar.
 */
test.describe('Recaptura de opciones de desplegable', () => {
  /**
   * Recorre los trabajos de recaptura habilitados e imprime o escribe los diffs de opciones.
   */
  test('Recapturar opciones de combobox de QA en los mapas JSON del tenant', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(0);
    await dashboardPage.expectLoaded();
    await runRefreshDropdownOptions(page);
  });
});
