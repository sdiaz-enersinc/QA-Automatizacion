import type {
  RegistroWizardDropdownOptionsMap,
  RegistroWizardFieldDefinition,
} from './registro-wizard';
import type { TenantBreadcrumbMatcher } from './tenant-breadcrumb';

/** Datos de prueba específicos del tenant para el módulo Registro Contratos energía. */
export interface RegistroCttosEnergiaTenantConfig {
  registroCttosEnergiaTabNames: readonly string[];
  registroCttosEnergiaEnabledTabNames: readonly string[];
  registroCttosEnergiaLockedTabNames: readonly string[];
  registroCttosEnergiaStandardContractColumns: readonly string[];
  registroCttosEnergiaMiscContractColumns: readonly string[];
  registroCttosEnergiaDecContractColumns: readonly string[];
  registroCttosEnergiaRespaldosColumns: readonly string[];
  registroCttosEnergiaLayoutBStandardTabs: readonly string[];
  registroCttosEnergiaLayoutAStandardTabs: readonly string[];
  registroCttosEnergiaLpNuevoContratoWizardSteps: readonly string[];
  registroCttosEnergiaUnrNuevoContratoWizardSteps: readonly string[];
  registroCttosEnergiaDdvNuevoContratoWizardSteps: readonly string[];
  registroCttosEnergiaRmsNuevoContratoWizardSteps: readonly string[];
  registroCttosEnergiaDecNuevoContratoWizardSteps: readonly string[];
  registroCttosEnergiaLpNuevoContratoFieldsDropdownOptions: RegistroWizardDropdownOptionsMap;
  registroCttosEnergiaUnrNuevoContratoFieldsDropdownOptions: RegistroWizardDropdownOptionsMap;
  registroCttosEnergiaDdvNuevoContratoFieldsDropdownOptions: RegistroWizardDropdownOptionsMap;
  registroCttosEnergiaRmsNuevoContratoFieldsDropdownOptions: RegistroWizardDropdownOptionsMap;
  registroCttosEnergiaDecNuevoContratoFieldsDropdownOptions: RegistroWizardDropdownOptionsMap;
  registroCttosEnergiaMiscNuevoRegistroFieldsDropdownOptions: RegistroWizardDropdownOptionsMap;
  registroCttosEnergiaLpNuevoContratoFields: readonly RegistroWizardFieldDefinition[];
  registroCttosEnergiaUnrNuevoContratoFields: readonly RegistroWizardFieldDefinition[];
  registroCttosEnergiaDdvNuevoContratoFields: readonly RegistroWizardFieldDefinition[];
  registroCttosEnergiaRmsNuevoContratoFields: readonly RegistroWizardFieldDefinition[];
  registroCttosEnergiaDecNuevoContratoFields: readonly RegistroWizardFieldDefinition[];
  registroCttosEnergiaMiscNuevoRegistroFields: readonly RegistroWizardFieldDefinition[];
  registroCttosEnergiaTabSlugs: Record<string, string>;
  registroCttosEnergiaTabBreadcrumbs: Record<string, TenantBreadcrumbMatcher>;
}

/** Etiqueta de pestaña habilitada de Contratos energía (específica del tenant en runtime). */
export type RegistroCttosEnergiaTabName = string;
