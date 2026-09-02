import type {
  RegistroWizardDropdownOptionsMap,
  RegistroWizardFieldDefinition,
} from './registro-wizard';

/** Tenant-specific test data for the Registro Otros contratos module. */
export interface RegistroOtrosContratosTenantConfig {
  registroOtrosContratosTabNames: readonly string[];
  registroOtrosContratosEnabledTabNames: readonly string[];
  registroOtrosContratosLockedTabNames: readonly string[];
  registroOtrosContratosMiscContractColumns: readonly string[];
  registroOtrosContratosAgrContractColumns: readonly string[];
  registroOtrosContratosMiscNuevoRegistroFields: readonly RegistroWizardFieldDefinition[];
  registroOtrosContratosMiscNuevoRegistroFieldsDropdownOptions: RegistroWizardDropdownOptionsMap;
  registroOtrosContratosTabSlugs: Record<string, string>;
  registroOtrosContratosTabBreadcrumbs: Record<string, string>;
}

/** Otros contratos tab label (tenant-specific at runtime). */
export type RegistroOtrosContratosTabName = string;
