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

/** Expected combobox content: exact labels, conditional (options or empty), or empty array (open-only). */
export type RegistroWizardDropdownExpectation = readonly string[] | 'conditional';

/** Dropdown expectations keyed by wizard field label (QA, Jun 2026). */
export type RegistroWizardDropdownOptionsMap = Record<string, RegistroWizardDropdownExpectation>;
