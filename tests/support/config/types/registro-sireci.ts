import type {
  RegistroWizardDropdownOptionsMap,
  RegistroWizardFieldDefinition,
} from './registro-wizard';

/** Datos de prueba específicos del tenant para el módulo Registro Sireci. */
export interface RegistroSireciTenantConfig {
  registroSireciTabNames: readonly string[];
  registroSireciEnabledTabNames: readonly string[];
  registroSireciLockedTabNames: readonly string[];
  registroSireciResumenColumns: readonly string[];
  registroSireciReporteColumns: readonly string[];
  registroSireciNuevoRegistroComboboxFields: readonly RegistroWizardFieldDefinition[];
  registroSireciNuevoRegistroTextDateFields: readonly RegistroWizardFieldDefinition[];
  registroSireciNuevoRegistroSpinbuttonLabels: readonly string[];
  registroSireciNuevoRegistroFieldsDropdownOptions: RegistroWizardDropdownOptionsMap;
  registroSireciTabSlugs: Record<string, string>;
  registroSireciTabBreadcrumbs: Record<string, string>;
  registroSireciSidebarHrefs: Record<string, string>;
}

/** Etiqueta de pestaña Sireci (específica del tenant en runtime). */
export type RegistroSireciTabName = string;
