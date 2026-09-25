/** Control kind for Registro Nuevo Registro / Nuevo Contrato wizard fields (QA, Jun 2026). */
export type RegistroWizardFieldKind = 'combobox' | 'textbox' | 'datepicker';

/** Metadata for a single field on a Registro wizard step. */
export interface RegistroWizardFieldDefinition {
  /** Visible label text without the required asterisk. */
  label: string;
  kind: RegistroWizardFieldKind;
  required?: boolean;
  disabled?: boolean;
  /** Field sits below the initial dialog viewport; scroll before assert. */
  requiresScroll?: boolean;
}

/** Combobox that must include these labels and may list additional UI options. */
export interface RegistroWizardDropdownMinimumExpectation {
  /** Option labels that must appear; extra UI options are allowed. */
  minimum: readonly string[];
}

/** Expected combobox content: exact labels, empty array (no options), conditional, or a minimum subset. */
export type RegistroWizardDropdownExpectation =
  | readonly string[]
  | 'conditional'
  | RegistroWizardDropdownMinimumExpectation;

/**
 * Returns whether a dropdown expectation is a minimum-subset map.
 *
 * @param value - Raw dropdown expectation from tenant JSON.
 */
export function isRegistroWizardDropdownMinimum(
  value: RegistroWizardDropdownExpectation | undefined,
): value is RegistroWizardDropdownMinimumExpectation {
  return Boolean(
    value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      Array.isArray((value as RegistroWizardDropdownMinimumExpectation).minimum),
  );
}

/** Dropdown expectations keyed by wizard field label (QA, Jun 2026). */
export type RegistroWizardDropdownOptionsMap = Record<string, RegistroWizardDropdownExpectation>;
