import type {
  RegistroWizardDropdownOptionsMap,
  RegistroWizardFieldDefinition,
} from './registro-wizard';

/** Tenant-specific test data for the Registro Planta y consumos module. */
export interface RegistroPlantaConsumosTenantConfig {
  registroPlantaConsumosTabNames: readonly string[];
  registroPlantaConsumosEnabledTabNames: readonly string[];
  registroPlantaConsumosLockedTabNames: readonly string[];
  registroPlantaConsumosCalendarWeekdayHeaders: readonly string[];
  registroPlantaConsumosCalendarAnoMonthCells: readonly string[];
  registroPlantaConsumosCalendarYearOptions: readonly string[];
  registroPlantaConsumosCalendarMonthOptions: readonly string[];
  registroPlantaConsumosCalendarMonthOptionsScroll: readonly string[];
  registroPlantaConsumosHeatRateColumns: readonly string[];
  registroPlantaConsumosParametrosRegasColumns: readonly string[];
  registroPlantaConsumosOefProyectadaColumns: readonly string[];
  registroPlantaConsumosConceptosOcColumns: readonly string[];
  registroPlantaConsumosCostosRegasColumns: readonly string[];
  registroPlantaConsumosGestionConceptosColumns: readonly string[];
  registroPlantaConsumosHeatRateNuevoRegistroWizardSteps: readonly string[];
  registroPlantaConsumosOefNuevoRegistroWizardSteps: readonly string[];
  registroPlantaConsumosHeatRateWizardDropdownOptions: RegistroWizardDropdownOptionsMap;
  registroPlantaConsumosOefWizardDropdownOptions: RegistroWizardDropdownOptionsMap;
  registroPlantaConsumosConceptoUnidadOptions: readonly string[];
  registroPlantaConsumosConceptosOcRegistroDropdownOptions: RegistroWizardDropdownOptionsMap;
  registroPlantaConsumosHeatRateNuevoRegistroFields: readonly RegistroWizardFieldDefinition[];
  registroPlantaConsumosOefNuevoRegistroFields: readonly RegistroWizardFieldDefinition[];
  registroPlantaConsumosConceptoFormFields: readonly RegistroWizardFieldDefinition[];
  registroPlantaConsumosConceptosOcRegistroFields: readonly RegistroWizardFieldDefinition[];
  registroPlantaConsumosConceptosOcRegistroSpinbuttonLabels: readonly string[];
  registroPlantaConsumosParametrosRegasFormLabels: readonly string[];
  registroPlantaConsumosTabSlugs: Record<string, string>;
  registroPlantaConsumosTabBreadcrumbs: Record<string, string>;
}

/** Planta y consumos tab label (tenant-specific at runtime). */
export type RegistroPlantaConsumosTabName = string;
