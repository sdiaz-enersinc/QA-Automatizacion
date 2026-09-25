import { expect, type Locator } from '@playwright/test';

/**
 * Lee los textos visibles de encabezados de columna de una tabla de datos.
 *
 * @param table - Localizador de tabla (típicamente `getByRole('table').first()`).
 */
export async function collectTableColumnHeaderLabels(table: Locator): Promise<string[]> {
  const headers = table.getByRole('columnheader');
  const texts = await headers.allTextContents();
  return texts.map((text) => text.replace(/\s+/g, ' ').trim()).filter(Boolean);
}

export interface AssertTableColumnHeadersMatchConfigOptions {
  /** Encabezados extra permitidos en la UI pero omitidos en la config (p. ej. Acciones). */
  additionalAllowedColumns?: readonly string[];
  /** Si es true, solo falla cuando faltan columnas de la config en la UI (modo subconjunto). */
  allowExtraColumns?: boolean;
  context?: string;
}

/**
 * Comprueba que los encabezados de columna coinciden con el conjunto configurado (estricto por defecto).
 *
 * @param table - Localizador de tabla.
 * @param expectedColumns - Columnas de datos de la config del tenant.
 * @param options - Columnas de chrome y modo subconjunto.
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
      const suffix = missing.length > 5 ? ` (+${missing.length - 5} más)` : '';
      parts.push(`faltan en la UI: ${preview}${suffix}`);
    }
    if (unexpected.length > 0) {
      const preview = unexpected.slice(0, 5).join(', ');
      const suffix = unexpected.length > 5 ? ` (+${unexpected.length - 5} más)` : '';
      parts.push(`en la UI pero no en la config: ${preview}${suffix}`);
    }
    throw new Error(`${prefix}Desajuste de encabezados de columna — ${parts.join('; ')}`);
  }).toPass({ timeout: 30_000 });
}
