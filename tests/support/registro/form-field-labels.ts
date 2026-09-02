import { expect, type Locator } from '@playwright/test';
import type { RegistroWizardFieldDefinition } from '../config/types/registro-wizard';

/**
 * Collects visible form field labels inside a Registro dialog.
 *
 * Rules:
 * - Scope is the dialog locator only (not page-level select dropdown portals).
 * - Only `.ant-form-item` rows with an interactive control are counted.
 * - Normalized labels are deduplicated while preserving first-seen order.
 */

const FORM_CONTROL_SELECTOR =
  'input, textarea, .ant-select, .ant-picker, [role="spinbutton"]';

/**
 * Normalizes a form label for comparison with tenant config (no required asterisk).
 *
 * @param text - Raw label text from the DOM.
 */
export function normalizeRegistroFormFieldLabel(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^\*\s*/, '');
}

/**
 * Builds the expected label list from wizard field definitions and optional extras.
 *
 * @param fields - Configured wizard fields for the active step or form.
 * @param extraLabels - Labels not modeled as wizard fields (e.g. spinbuttons).
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
  /** When set, scrolls this element to the bottom before collecting (long forms). */
  scrollContainer?: Locator;
}

/**
 * Reads normalized field labels from Ant Design form items inside a dialog.
 *
 * @param dialog - Open modal or wizard dialog locator.
 * @param options - Optional scroll target before collection.
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
  /** When true, only fail on config labels missing from UI (subset mode). */
  allowExtra?: boolean;
  /** Prefix for error messages (e.g. dialog name). */
  context?: string;
}

/**
 * Compares collected UI labels to the expected config set.
 *
 * @param collected - Labels from {@link collectRegistroFormFieldLabels}.
 * @param expected - Configured label list.
 * @param options - Strict vs subset mode and message context.
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
    const suffix = missing.length > 5 ? ` (+${missing.length - 5} more)` : '';
    parts.push(`missing from UI: ${preview}${suffix}`);
  }
  if (unexpected.length > 0) {
    const preview = unexpected.slice(0, 5).join(', ');
    const suffix = unexpected.length > 5 ? ` (+${unexpected.length - 5} more)` : '';
    parts.push(`in UI but not in config: ${preview}${suffix}`);
  }
  throw new Error(`${prefix}Field label mismatch — ${parts.join('; ')}`);
}

export interface AssertRegistroWizardFieldsMatchConfigOptions {
  /** When true, only assert config fields exist in the UI. */
  allowExtra?: boolean;
  /** Labels outside wizard field definitions (e.g. spinbuttons). */
  extraExpectedLabels?: readonly string[];
  /** Locator to scroll before collecting when any field uses requiresScroll. */
  scrollContainer?: Locator;
  /** Last scroll-requiring field control; scrolled into view before collect. */
  scrollLastFieldControl?: Locator;
  context?: string;
}

/**
 * Scrolls if needed, collects dialog labels, and asserts they match config.
 *
 * @param dialog - Open wizard or flat-form dialog.
 * @param fields - Expected wizard fields for the current step.
 * @param options - allowExtra, extra labels, scroll hints, error context.
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
