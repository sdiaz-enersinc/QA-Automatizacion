import type {
  RegistroWizardDropdownOptionsMap,
  RegistroWizardFieldDefinition,
} from './registro-wizard';

/** Datos de prueba específicos del tenant para el módulo Registro RPM. */
export interface RegistroRpmTenantConfig {
  registroRpmTabNames: readonly string[];
  registroRpmEnabledTabNames: readonly string[];
  registroRpmLockedTabNames: readonly string[];
  registroRpmSubmoduleLabel: string;
  registroRpmDefaultTab: string;
  registroRpmXmlColumns: readonly string[];
  registroRpmCrearRegistroFields: readonly RegistroWizardFieldDefinition[];
  registroRpmCrearRegistroFieldsDropdownOptions: RegistroWizardDropdownOptionsMap;
  registroRpmTabSlugs: Record<string, string>;
  registroRpmTabBreadcrumbs: Record<string, string>;
}

/** Etiqueta de pestaña RPM (específica del tenant en runtime). */
export type RegistroRpmTabName = string;
