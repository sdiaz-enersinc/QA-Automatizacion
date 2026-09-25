import type {
  RegistroWizardDropdownOptionsMap,
  RegistroWizardFieldDefinition,
} from './registro-wizard';

/** Datos de prueba específicos del tenant para el módulo Registro Otros contratos. */
export interface RegistroOtrosContratosTenantConfig {
  registroOtrosContratosTabNames: readonly string[];
  registroOtrosContratosEnabledTabNames: readonly string[];
  registroOtrosContratosLockedTabNames: readonly string[];
  registroOtrosContratosDefaultTab: string;
  registroOtrosContratosMiscTab: string;
  registroOtrosContratosAgrTab: string;
  registroOtrosContratosMiscContractColumns: readonly string[];
  registroOtrosContratosAgrContractColumns: readonly string[];
  registroOtrosContratosMiscNuevoRegistroFields: readonly RegistroWizardFieldDefinition[];
  registroOtrosContratosMiscNuevoRegistroFieldsDropdownOptions: RegistroWizardDropdownOptionsMap;
  registroOtrosContratosTabSlugs: Record<string, string>;
  registroOtrosContratosTabBreadcrumbs: Record<string, string>;
}

/** Etiqueta de pestaña de Otros contratos (específica del tenant en runtime). */
export type RegistroOtrosContratosTabName = string;
