import { expect, type Locator } from '@playwright/test';
import type { RegistroWizardFieldDefinition } from '../config/types/registro-wizard';

/**
 * Recolecta etiquetas visibles de campos de formulario dentro de un diálogo de Registro.
 *
 * Reglas:
 * - El alcance es solo el localizador del diálogo (no los portales de select a nivel de página).
 * - Solo se cuentan filas `.ant-form-item` con un control interactivo.
 * - Las etiquetas normalizadas se deduplican conservando el orden de primera aparición.
 */

const FORM_CONTROL_SELECTOR =
  'input, textarea, .ant-select, .ant-picker, [role="spinbutton"]';

/**
 * Normaliza una etiqueta de formulario para compararla con la config del tenant (sin asterisco de obligatorio).
 *
 * @param text - Texto crudo de la etiqueta desde el DOM.
 */
export function normalizeRegistroFormFieldLabel(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^\*\s*/, '');
}

/**
 * Construye la lista de etiquetas esperadas a partir de las definiciones de campo del asistente y extras opcionales.
 *
 * @param fields - Campos del asistente configurados para el paso o formulario activo.
 * @param extraLabels - Etiquetas no modeladas como campos del asistente (p. ej. spinbuttons).
 */
export function expectedLabelsFromWizardFields(
  fields: readonly RegistroWizardFieldDefinition[],
  extraLabels?: readonly string[],
): string[] {
  const labels = fields.map((field) => field.label);
  if (extraLabels?.length) {
    labels.push(...extraLabels);
  }
  return labels;
}

export interface CollectRegistroFormFieldLabelsOptions {
  /** Si se define, hace scroll al final de este elemento antes de recolectar (formularios largos). */
  scrollContainer?: Locator;
}

/**
 * Lee etiquetas de campo normalizadas de los form-item de Ant Design dentro de un diálogo.
 *
 * @param dialog - Localizador del modal o asistente abierto.
 * @param options - Destino de scroll opcional antes de recolectar.
 */
export async function collectRegistroFormFieldLabels(
  dialog: Locator,
  options?: CollectRegistroFormFieldLabelsOptions,
): Promise<string[]> {
  if (options?.scrollContainer) {
    await options.scrollContainer.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });
  }

  const rawLabels = await dialog.locator('.ant-form-item').evaluateAll((items, controlSelector) => {
    const seen = new Set<string>();
    const out: string[] = [];

    for (const item of items) {
      if (!item.querySelector(controlSelector)) {
        continue;
      }
      const style = window.getComputedStyle(item);
      if (style.display === 'none' || style.visibility === 'hidden') {
        continue;
      }
      const labelEl =
        item.querySelector('.ant-form-item-label label') ??
        item.querySelector('.ant-form-item-label');
      const text = labelEl?.textContent?.trim() ?? '';
      if (!text) {
        continue;
      }
      const normalized = text
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/^\*\s*/, '');
      if (!normalized || seen.has(normalized)) {
        continue;
      }
      seen.add(normalized);
      out.push(normalized);
    }
    return out;
  }, FORM_CONTROL_SELECTOR);

  return rawLabels;
}

export interface AssertRegistroFormFieldLabelsMatchConfigOptions {
  /** Si es true, solo falla cuando faltan etiquetas de la config en la UI (modo subconjunto). */
  allowExtra?: boolean;
  /** Prefijo de los mensajes de error (p. ej. nombre del diálogo). */
  context?: string;
}

/**
 * Compara las etiquetas recolectadas de la UI con el conjunto esperado de la config.
 *
 * @param collected - Etiquetas de {@link collectRegistroFormFieldLabels}.
 * @param expected - Lista de etiquetas configuradas.
 * @param options - Modo estricto vs subconjunto y contexto del mensaje.
 */
export function assertRegistroFormFieldLabelsMatchConfig(
  collected: readonly string[],
  expected: readonly string[],
  options?: AssertRegistroFormFieldLabelsMatchConfigOptions,
): void {
  const expectedSet = new Set(expected);
  const collectedSet = new Set(collected);

  const missing = expected.filter((label) => !collectedSet.has(label));
  const unexpected = options?.allowExtra
    ? []
    : collected.filter((label) => !expectedSet.has(label));

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
    throw new Error(`${prefix}Desajuste de etiquetas de campo — ${parts.join('; ')}`);
}

export interface AssertRegistroWizardFieldsMatchConfigOptions {
  /** Si es true, solo aserta que los campos de la config existen en la UI. */
  allowExtra?: boolean;
  /** Etiquetas fuera de las definiciones de campo del asistente (p. ej. spinbuttons). */
  extraExpectedLabels?: readonly string[];
  /** Localizador al que hacer scroll antes de recolectar si algún campo usa requiresScroll. */
  scrollContainer?: Locator;
  /** Último control que requiere scroll; se lleva a la vista antes de recolectar. */
  scrollLastFieldControl?: Locator;
  context?: string;
}

/**
 * Hace scroll si hace falta, recolecta etiquetas del diálogo y comprueba que coinciden con la config.
 *
 * @param dialog - Diálogo de asistente o formulario plano abierto.
 * @param fields - Campos esperados del asistente para el paso actual.
 * @param options - allowExtra, etiquetas extra, pistas de scroll y contexto de error.
 */
export async function assertRegistroWizardFieldsMatchConfig(
  dialog: Locator,
  fields: readonly RegistroWizardFieldDefinition[],
  options?: AssertRegistroWizardFieldsMatchConfigOptions,
): Promise<void> {
  if (options?.scrollLastFieldControl) {
    await options.scrollLastFieldControl.scrollIntoViewIfNeeded();
  } else if (fields.some((field) => field.requiresScroll)) {
    const body = dialog.locator('.ant-modal-body').first();
    if (await body.count()) {
      await body.evaluate((el) => {
        el.scrollTop = el.scrollHeight;
      });
    }
  }

  const expected = expectedLabelsFromWizardFields(fields, options?.extraExpectedLabels);

  await expect(async () => {
    const collected = await collectRegistroFormFieldLabels(dialog, {
      scrollContainer: options?.scrollContainer,
    });
    assertRegistroFormFieldLabelsMatchConfig(collected, expected, {
      allowExtra: options?.allowExtra,
      context: options?.context,
    });
  }).toPass({ timeout: 30_000 });
}
