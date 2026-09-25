import { expect, type Locator } from '@playwright/test';

/**
 * Normaliza la etiqueta de un menuitem del menú lateral para compararla con la config del tenant.
 *
 * @param text - Texto crudo del menuitem desde el DOM.
 */
export function normalizeRegistroSidebarLabel(text: string): string {
  return text.replace(/^🔒\s*/, '').replace(/\s+/g, ' ').trim();
}

/**
 * Lee las etiquetas visibles de ítems del menú lateral, conservando el orden del DOM (se mantienen duplicados).
 *
 * @param items - Localizadores de menuitem o enlace en un flyout del menú lateral.
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
  /** Prefijo de los mensajes de error (p. ej. nombre del módulo). */
  context?: string;
}

/**
 * Comprueba que las etiquetas del menú lateral coinciden exactamente con la config del tenant.
 * Etiquetas extra, faltantes o duplicadas fallan la aserción.
 *
 * @param items - Localizadores de menuitem o enlace a recolectar.
 * @param expected - Etiquetas configuradas para el flyout.
 * @param options - Contexto opcional para el mensaje de error.
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
      const suffix = missing.length > 5 ? ` (+${missing.length - 5} más)` : '';
      parts.push(`faltan en la UI: ${preview}${suffix}`);
    }
    if (unexpected.length > 0) {
      const preview = unexpected.slice(0, 5).join(', ');
      const suffix = unexpected.length > 5 ? ` (+${unexpected.length - 5} más)` : '';
      parts.push(`en la UI pero no en la config: ${preview}${suffix}`);
    }
    if (duplicates.length > 0) {
      parts.push(`etiquetas duplicadas en la UI: ${duplicates.join(', ')}`);
    }
    throw new Error(`${prefix}Desajuste de etiquetas del menú lateral — ${parts.join('; ')}`);
  }).toPass({ timeout: 30_000 });
}
