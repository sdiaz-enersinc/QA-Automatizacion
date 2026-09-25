/** Tipo de control de campos del asistente Nuevo Registro / Nuevo Contrato de Registro (QA, jun 2026). */
export type RegistroWizardFieldKind = 'combobox' | 'textbox' | 'datepicker';

/** Metadatos de un campo en un paso del asistente de Registro. */
export interface RegistroWizardFieldDefinition {
  /** Texto de etiqueta visible sin el asterisco de obligatorio. */
  label: string;
  kind: RegistroWizardFieldKind;
  required?: boolean;
  disabled?: boolean;
  /** El campo queda bajo el viewport inicial del diálogo; hay que hacer scroll antes de asertar. */
  requiresScroll?: boolean;
}

/** Combobox que debe incluir estas etiquetas y puede listar opciones extra en la UI. */
export interface RegistroWizardDropdownMinimumExpectation {
  /** Etiquetas de opción que deben aparecer; se permiten extras en la UI. */
  minimum: readonly string[];
}

/** Contenido esperado del combobox: etiquetas exactas, arreglo vacío (sin opciones), condicional o subconjunto mínimo. */
export type RegistroWizardDropdownExpectation =
  | readonly string[]
  | 'conditional'
  | RegistroWizardDropdownMinimumExpectation;

/**
 * Indica si una expectativa de desplegable es un mapa de subconjunto mínimo.
 *
 * @param value - Expectativa cruda de desplegable del JSON del tenant.
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

/** Expectativas de desplegable indexadas por etiqueta de campo del asistente (QA, jun 2026). */
export type RegistroWizardDropdownOptionsMap = Record<string, RegistroWizardDropdownExpectation>;
