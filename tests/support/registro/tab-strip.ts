import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Normaliza la etiqueta de una pestaña para compararla con la config del tenant.
 *
 * @param text - Texto crudo de la pestaña desde el DOM.
 */
export function normalizeRegistroTabLabel(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export interface AssertTabStripMatchesConfigOptions {
  /** Pestañas que deben verse y estar habilitadas. */
  enabledTabs: readonly string[];
  /** Pestañas que deben verse y estar deshabilitadas (bloqueadas por ACL). */
  lockedTabs?: readonly string[];
  /** Prefijo de los mensajes de error (p. ej. nombre del módulo). */
  context?: string;
}

/**
 * Lee las etiquetas visibles de un tablist, conservando el orden de primera aparición.
 *
 * @param tablist - Localizador del tablist (típicamente `page.getByRole('tablist').first()`).
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
 * Comprueba que la tira de pestañas del gestor coincide exactamente con la config del tenant.
 * Pestañas extra en la UI se tratan como error de ACL/config.
 *
 * @param page - Página de Playwright que contiene la tira de pestañas del módulo.
 * @param options - Nombres de pestañas habilitadas/bloqueadas y contexto del mensaje.
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
  const prefix = options?.context ? `${options.context} — ` : '';

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
      const suffix = missing.length > 5 ? ` (+${missing.length - 5} más)` : '';
      parts.push(`faltan en la UI: ${preview}${suffix}`);
    }
    if (unexpected.length > 0) {
      const preview = unexpected.slice(0, 5).join(', ');
      const suffix = unexpected.length > 5 ? ` (+${unexpected.length - 5} más)` : '';
      parts.push(`en la UI pero no en la config (ACL): ${preview}${suffix}`);
    }
    if (duplicates.length > 0) {
      parts.push(`pestañas duplicadas en la UI: ${duplicates.join(', ')}`);
    }
    if (lockedButEnabled.length > 0) {
      parts.push(`pestañas bloqueadas habilitadas en la UI (ACL): ${lockedButEnabled.join(', ')}`);
    }
    if (enabledButDisabled.length > 0) {
      parts.push(`pestañas habilitadas deshabilitadas en la UI (ACL): ${enabledButDisabled.join(', ')}`);
    }
    throw new Error(`${prefix}Desajuste de la tira de pestañas — ${parts.join('; ')}`);
  }).toPass({ timeout: 30_000 });
}
