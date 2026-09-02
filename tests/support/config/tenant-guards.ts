import { test } from '@playwright/test';
import { isModuleEnabled, isTabEnabled } from './load-tenant-config';
import type { ModuleId } from './module-registry';

/**
 * Skips the current test when the module or its parent group is disabled in tenant.json.
 *
 * @param moduleId - Canonical module id or a string key from tenant.json.
 * @param reason - Optional skip message; defaults to a module-disabled notice.
 */
export function skipUnlessModuleEnabled(moduleId: ModuleId | string, reason?: string): void {
  if (!isModuleEnabled(moduleId)) {
    test.skip(true, reason ?? `Module ${moduleId} disabled for tenant`);
  }
}

/**
 * Skips the current test when the tab is not in the module's enabled tab list.
 *
 * @param moduleId - Canonical module id or a string key from tenant.json.
 * @param tabName - Visible tab label from module JSON.
 * @param reason - Optional skip message; defaults to a tab-disabled notice.
 */
export function skipUnlessTabEnabled(
  moduleId: ModuleId | string,
  tabName: string,
  reason?: string,
): void {
  if (!isTabEnabled(moduleId, tabName)) {
    test.skip(true, reason ?? `Tab ${tabName} disabled for module ${moduleId}`);
  }
}

/**
 * Skips the current test when none of the given tabs is enabled for the module.
 *
 * @param moduleId - Canonical module id or a string key from tenant.json.
 * @param tabNames - Tab labels; skip if every one is disabled.
 * @param reason - Optional skip message.
 */
export function skipUnlessAnyTabEnabled(
  moduleId: ModuleId | string,
  tabNames: readonly string[],
  reason?: string,
): void {
  const anyEnabled = tabNames.some((tabName) => isTabEnabled(moduleId, tabName));
  if (!anyEnabled) {
    test.skip(
      true,
      reason ?? `All tabs disabled for module ${moduleId}: ${tabNames.join(', ')}`,
    );
  }
}

/**
 * Skips the current test when any of the given tabs is disabled for the module.
 * Use for cross-navigation tests that require every tab in the pair (e.g. tab cross-over).
 *
 * @param moduleId - Canonical module id or a string key from tenant.json.
 * @param tabNames - Tab labels that must all be enabled.
 * @param reason - Optional skip message.
 */
export function skipUnlessAllTabsEnabled(
  moduleId: ModuleId | string,
  tabNames: readonly string[],
  reason?: string,
): void {
  const disabled = tabNames.filter((tabName) => !isTabEnabled(moduleId, tabName));
  if (disabled.length > 0) {
    test.skip(
      true,
      reason ?? `Tabs disabled for module ${moduleId}: ${disabled.join(', ')}`,
    );
  }
}

/**
 * Runs the callback only when the tab is enabled for the module; no-op when disabled.
 *
 * @param moduleId - Canonical module id or a string key from tenant.json.
 * @param tabName - Visible tab label from module JSON.
 * @param fn - Work to run when the tab is enabled.
 * @param stepName - Optional Playwright step title.
 */
export async function whenTabEnabled(
  moduleId: ModuleId | string,
  tabName: string,
  fn: () => void | Promise<void>,
  stepName?: string,
): Promise<void> {
  if (!isTabEnabled(moduleId, tabName)) {
    return;
  }

  if (stepName) {
    await test.step(stepName, fn);
  } else {
    await fn();
  }
}
