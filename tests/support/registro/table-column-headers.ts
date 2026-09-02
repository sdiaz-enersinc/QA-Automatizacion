import { expect, type Locator } from '@playwright/test';

/**
 * Reads visible column header texts from a data table.
 *
 * @param table - Table locator (typically `getByRole('table').first()`).
 */
export async function collectTableColumnHeaderLabels(table: Locator): Promise<string[]> {
  const headers = table.getByRole('columnheader');
  const texts = await headers.allTextContents();
  return texts.map((text) => text.replace(/\s+/g, ' ').trim()).filter(Boolean);
}

export interface AssertTableColumnHeadersMatchConfigOptions {
  /** Extra headers allowed in the UI but omitted from config (e.g. Acciones). */
  additionalAllowedColumns?: readonly string[];
  /** When true, only fail on config columns missing from UI (subset mode). */
  allowExtraColumns?: boolean;
  context?: string;
}

/**
 * Asserts table column headers match the configured set (strict by default).
 *
 * @param table - Table locator.
 * @param expectedColumns - Data columns from tenant config.
 * @param options - Chrome columns and subset mode.
 */
export async function assertTableColumnHeadersMatchConfig(
  table: Locator,
  expectedColumns: readonly string[],
  options?: AssertTableColumnHeadersMatchConfigOptions,
): Promise<void> {
  const allowed = new Set([
    ...expectedColumns,
    ...(options?.additionalAllowedColumns ?? []),
  ]);

  await expect(async () => {
    const collected = await collectTableColumnHeaderLabels(table);
    const collectedSet = new Set(collected);

    const missing = expectedColumns.filter((name) => !collectedSet.has(name));
    const unexpected = options?.allowExtraColumns
      ? []
      : collected.filter((name) => !allowed.has(name));

    if (missing.length === 0 && unexpected.length === 0) {
      return;
    }

    const prefix = options?.context ? `${options.context} — ` : '';
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
    throw new Error(`${prefix}Column header mismatch — ${parts.join('; ')}`);
  }).toPass({ timeout: 30_000 });
}
