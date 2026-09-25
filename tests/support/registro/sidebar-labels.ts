import { expect, type Locator } from '@playwright/test';

/**
 * Normalizes a sidebar menuitem label for comparison with tenant config.
 *
 * @param text - Raw menuitem text from the DOM.
 */
export function normalizeRegistroSidebarLabel(text: string): string {
  return text.replace(/^🔒\s*/, '').replace(/\s+/g, ' ').trim();
}

/**
 * Reads visible sidebar item labels, preserving DOM order (duplicates kept).
 *
 * @param items - Menuitem or link locators in a sidebar flyout.
 */
export async function collectSidebarItemLabels(items: Locator): Promise<string[]> {
  const count = await items.count();
  const out: string[] = [];
  for (let index = 0; index < count; index += 1) {
    const label = normalizeRegistroSidebarLabel((await items.nth(index).innerText()) ?? '');
    if (!label) {
      continue;
    }
    out.push(label);
  }
  return out;
}

export interface AssertSidebarLabelsMatchConfigOptions {
  /** Prefix for error messages (e.g. module name). */
  context?: string;
}

/**
 * Asserts sidebar item labels match tenant config exactly.
 * Extra, missing, or duplicate labels fail the assertion.
 *
 * @param items - Menuitem or link locators to collect.
 * @param expected - Configured labels for the flyout.
 * @param options - Optional error-message context.
 */
export async function assertSidebarLabelsMatchConfig(
  items: Locator,
  expected: readonly string[],
  options?: AssertSidebarLabelsMatchConfigOptions,
): Promise<void> {
  const expectedList = expected.filter((name) => name.length > 0);
  const expectedSet = new Set(expectedList);
  const prefix = options?.context ? `${options.context} — ` : '';

  await expect(async () => {
    const collected = await collectSidebarItemLabels(items);
    const collectedSet = new Set(collected);
    const missing = expectedList.filter((name) => !collectedSet.has(name));
    const unexpected = collected.filter((name) => !expectedSet.has(name));
    const duplicates = [
      ...new Set(collected.filter((name, index) => collected.indexOf(name) !== index)),
    ];

    if (missing.length === 0 && unexpected.length === 0 && duplicates.length === 0) {
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
      parts.push(`in UI but not in config: ${preview}${suffix}`);
    }
    if (duplicates.length > 0) {
      parts.push(`duplicate labels in UI: ${duplicates.join(', ')}`);
    }
    throw new Error(`${prefix}Sidebar label mismatch — ${parts.join('; ')}`);
  }).toPass({ timeout: 30_000 });
}
