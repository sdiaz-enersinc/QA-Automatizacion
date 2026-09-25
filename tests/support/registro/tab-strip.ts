import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Normalizes a tab label for comparison with tenant config.
 *
 * @param text - Raw tab text from the DOM.
 */
export function normalizeRegistroTabLabel(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export interface AssertTabStripMatchesConfigOptions {
  /** Tabs that must be visible and enabled. */
  enabledTabs: readonly string[];
  /** Tabs that must be visible and disabled (ACL-locked). */
  lockedTabs?: readonly string[];
  /** Prefix for error messages (e.g. module name). */
  context?: string;
}

/**
 * Reads visible tab labels from a tablist, preserving first-seen order.
 *
 * @param tablist - Tablist locator (typically `page.getByRole('tablist').first()`).
 */
export async function collectTabStripLabels(tablist: Locator): Promise<string[]> {
  const tabs = tablist.getByRole('tab');
  const texts = await tabs.allTextContents();
  const seen = new Set<string>();
  const out: string[] = [];
  for (const text of texts) {
    const normalized = normalizeRegistroTabLabel(text);
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    out.push(normalized);
  }
  return out;
}

/**
 * Asserts the gestor tab strip matches tenant config exactly.
 * Extra tabs in the UI are treated as ACL/config errors.
 *
 * @param page - Playwright page containing the module tab strip.
 * @param options - Enabled/locked tab names and message context.
 */
export async function assertTabStripMatchesConfig(
  page: Page,
  options: AssertTabStripMatchesConfigOptions,
): Promise<void> {
  const enabledTabs = options.enabledTabs.filter((name) => name.length > 0);
  const lockedTabs = (options.lockedTabs ?? []).filter((name) => name.length > 0);
  const expected = [...enabledTabs, ...lockedTabs];
  const expectedSet = new Set(expected);
  const tablist = page.getByRole('tablist').first();
  const prefix = options.context ? `${options.context} — ` : '';

  await expect(async () => {
    await expect(tablist).toBeVisible();
    const tabs = tablist.getByRole('tab');
    const count = await tabs.count();
    const collected: string[] = [];
    const enabledInUi: string[] = [];
    const disabledInUi: string[] = [];

    for (let index = 0; index < count; index += 1) {
      const tab = tabs.nth(index);
      const label = normalizeRegistroTabLabel((await tab.textContent()) ?? '');
      if (!label) {
        continue;
      }
      collected.push(label);
      if (await tab.isDisabled()) {
        disabledInUi.push(label);
      } else {
        enabledInUi.push(label);
      }
    }

    const collectedSet = new Set(collected);
    const missing = expected.filter((name) => !collectedSet.has(name));
    const unexpected = collected.filter((name) => !expectedSet.has(name));
    const duplicates = [
      ...new Set(collected.filter((name, index) => collected.indexOf(name) !== index)),
    ];
    const lockedButEnabled = lockedTabs.filter((name) => enabledInUi.includes(name));
    const enabledButDisabled = enabledTabs.filter((name) => disabledInUi.includes(name));

    if (
      missing.length === 0 &&
      unexpected.length === 0 &&
      duplicates.length === 0 &&
      lockedButEnabled.length === 0 &&
      enabledButDisabled.length === 0
    ) {
      return;
    }

    const parts: string[] = [];
    if (missing.length > 0) {
      const preview = missing.slice(0, 5).join(', ');
      const suffix = missing.length > 5 ? ` (+${missing.length - 5} more)` : '';
      parts.push(`missing from UI: ${preview}${suffix}`);
    }
    if (unexpected.length > 0) {
      const preview = unexpected.slice(0, 5).join(', ');
      const suffix = unexpected.length > 5 ? ` (+${unexpected.length - 5} more)` : '';
      parts.push(`in UI but not in config (ACL): ${preview}${suffix}`);
    }
    if (duplicates.length > 0) {
      parts.push(`duplicate tabs in UI: ${duplicates.join(', ')}`);
    }
    if (lockedButEnabled.length > 0) {
      parts.push(`locked tabs enabled in UI (ACL): ${lockedButEnabled.join(', ')}`);
    }
    if (enabledButDisabled.length > 0) {
      parts.push(`enabled tabs disabled in UI (ACL): ${enabledButDisabled.join(', ')}`);
    }
    throw new Error(`${prefix}Tab strip mismatch — ${parts.join('; ')}`);
  }).toPass({ timeout: 30_000 });
}
