import { test } from '../tests/support/fixtures';
import { runRefreshDropdownOptions } from './refresh-dropdown-options';

/**
 * Maintenance runner: harvests combobox options from QA into tenant JSON.
 * Not part of the default suite (testMatch is tenant specs only).
 *
 * Env: REFRESH_DROPDOWNS_WRITE=1 to persist, REFRESH_DROPDOWNS_MODULE=<id> to filter.
 */
test.describe('Refresh dropdown options', () => {
  /**
   * Walks enabled harvest jobs and prints or writes dropdown-option diffs.
   */
  test('Harvest QA combobox options into tenant JSON maps', async ({
    page,
    dashboardPage,
  }) => {
    test.setTimeout(0);
    await dashboardPage.expectLoaded();
    await runRefreshDropdownOptions(page);
  });
});
