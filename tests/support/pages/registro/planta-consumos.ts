import { expect, Locator } from '@playwright/test';
import {
  getRegistroPlantaConsumosConfig,
  getModuleEnabledTabNames,
  isModuleEnabled,
  toTabSlugRecord,
} from '../../config/load-tenant-config';
import { MODULE_IDS } from '../../config/module-registry';
import type { RegistroPlantaConsumosTabName } from '../../config/types/registro-planta-consumos';
import {
  REGISTRO_WIZARD_FIELD_ASSERT_COMBUSTIBLE,
  REGISTRO_WIZARD_FIELD_ASSERT_ENERGIA,
  RegistroNavigationBasePage,
  type RegistroWizardDropdownOptionsMap,
  type RegistroWizardFieldDefinition,
} from './registro-navigation-base';
import { assertRegistroWizardFieldsMatchConfig } from '../../registro/form-field-labels';
import { assertTableColumnHeadersMatchConfig } from '../../registro/table-column-headers';

export type { RegistroPlantaConsumosTabName };

const cfg = getRegistroPlantaConsumosConfig();

/** Whether the Registro Planta y consumos module is enabled for the active tenant. */
export const REGISTRO_PLANTA_CONSUMOS_ENABLED = isModuleEnabled(MODULE_IDS.registroPlantaConsumos);

/** Tab labels on the Planta y consumos module (tenant config). */
export const REGISTRO_PLANTA_CONSUMOS_TAB_NAMES = cfg.registroPlantaConsumosTabNames;

/** Tabs reachable with current tenant credentials. */
export const REGISTRO_PLANTA_CONSUMOS_ENABLED_TAB_NAMES = getModuleEnabledTabNames(
  MODULE_IDS.registroPlantaConsumos,
);

export const REGISTRO_PLANTA_CONSUMOS_LOCKED_TAB_NAMES = cfg.registroPlantaConsumosLockedTabNames;

/** Calendar weekday column headers (Mes view). */
export const REGISTRO_PLANTA_CONSUMOS_CALENDAR_WEEKDAY_HEADERS =
  cfg.registroPlantaConsumosCalendarWeekdayHeaders;

/** Calendar month tile labels (Año view). */
export const REGISTRO_PLANTA_CONSUMOS_CALENDAR_ANO_MONTH_CELLS =
  cfg.registroPlantaConsumosCalendarAnoMonthCells;

/** Expected year options in calendar year dropdown. */
export const REGISTRO_PLANTA_CONSUMOS_CALENDAR_YEAR_OPTIONS =
  cfg.registroPlantaConsumosCalendarYearOptions;

/** Expected month options visible without scroll in calendar month dropdown. */
export const REGISTRO_PLANTA_CONSUMOS_CALENDAR_MONTH_OPTIONS =
  cfg.registroPlantaConsumosCalendarMonthOptions;

/** Additional month options reachable by scrolling the month dropdown. */
export const REGISTRO_PLANTA_CONSUMOS_CALENDAR_MONTH_OPTIONS_SCROLL =
  cfg.registroPlantaConsumosCalendarMonthOptionsScroll;

/** Heat Rate grid column headers (Layout B). */
export const REGISTRO_PLANTA_CONSUMOS_HEAT_RATE_COLUMNS = cfg.registroPlantaConsumosHeatRateColumns;

/** Parametros Regas grid column headers (Layout B). */
export const REGISTRO_PLANTA_CONSUMOS_PARAMETROS_REGAS_COLUMNS =
  cfg.registroPlantaConsumosParametrosRegasColumns;

/** OEF Proyectada grid column headers (Layout B). */
export const REGISTRO_PLANTA_CONSUMOS_OEF_PROYECTADA_COLUMNS =
  cfg.registroPlantaConsumosOefProyectadaColumns;

/** Conceptos OC grid column headers (Layout B). */
export const REGISTRO_PLANTA_CONSUMOS_CONCEPTOS_OC_COLUMNS =
  cfg.registroPlantaConsumosConceptosOcColumns;

/** Costos Regas grid column headers (Layout B). */
export const REGISTRO_PLANTA_CONSUMOS_COSTOS_REGAS_COLUMNS =
  cfg.registroPlantaConsumosCostosRegasColumns;

/** Gestion Conceptos grid column headers (Layout B). */
export const REGISTRO_PLANTA_CONSUMOS_GESTION_CONCEPTOS_COLUMNS =
  cfg.registroPlantaConsumosGestionConceptosColumns;

/** Wizard step titles for Heat Rate Nuevo Registro. */
export const REGISTRO_PLANTA_CONSUMOS_HEAT_RATE_NUEVO_REGISTRO_WIZARD_STEPS =
  cfg.registroPlantaConsumosHeatRateNuevoRegistroWizardSteps;

/** Wizard step titles for OEF Proyectada Nuevo Registro. */
export const REGISTRO_PLANTA_CONSUMOS_OEF_NUEVO_REGISTRO_WIZARD_STEPS =
  cfg.registroPlantaConsumosOefNuevoRegistroWizardSteps;

/** Expected dropdown options per Heat Rate wizard combobox. */
export const REGISTRO_PLANTA_CONSUMOS_HEAT_RATE_WIZARD_DROPDOWN_OPTIONS: RegistroWizardDropdownOptionsMap =
  cfg.registroPlantaConsumosHeatRateWizardDropdownOptions;

/** Expected dropdown options per OEF Proyectada wizard combobox. */
export const REGISTRO_PLANTA_CONSUMOS_OEF_WIZARD_DROPDOWN_OPTIONS: RegistroWizardDropdownOptionsMap =
  cfg.registroPlantaConsumosOefWizardDropdownOptions;

/** Shared Unidad options for concept forms. */
export const REGISTRO_PLANTA_CONSUMOS_CONCEPTO_UNIDAD_OPTIONS =
  cfg.registroPlantaConsumosConceptoUnidadOptions;

/** Expected dropdown options for Conceptos OC Nuevo Registro. */
export const REGISTRO_PLANTA_CONSUMOS_CONCEPTOS_OC_REGISTRO_DROPDOWN_OPTIONS: RegistroWizardDropdownOptionsMap =
  cfg.registroPlantaConsumosConceptosOcRegistroDropdownOptions;

/** Step-1 form fields for Heat Rate Nuevo Registro. */
export const REGISTRO_PLANTA_CONSUMOS_HEAT_RATE_NUEVO_REGISTRO_FIELDS: readonly RegistroWizardFieldDefinition[] =
  cfg.registroPlantaConsumosHeatRateNuevoRegistroFields;

/** Step-1 form fields for OEF Proyectada Nuevo Registro. */
export const REGISTRO_PLANTA_CONSUMOS_OEF_NUEVO_REGISTRO_FIELDS: readonly RegistroWizardFieldDefinition[] =
  cfg.registroPlantaConsumosOefNuevoRegistroFields;

/** Form fields for Nuevo Concepto / Gestion Conceptos Nuevo Registro. */
export const REGISTRO_PLANTA_CONSUMOS_CONCEPTO_FORM_FIELDS: readonly RegistroWizardFieldDefinition[] =
  cfg.registroPlantaConsumosConceptoFormFields;

/** Form fields for Conceptos OC Nuevo Registro. */
export const REGISTRO_PLANTA_CONSUMOS_CONCEPTOS_OC_REGISTRO_FIELDS: readonly RegistroWizardFieldDefinition[] =
  cfg.registroPlantaConsumosConceptosOcRegistroFields;

/** Spinbutton labels for Conceptos OC Nuevo Registro (not modeled as wizard field kinds). */
export const REGISTRO_PLANTA_CONSUMOS_CONCEPTOS_OC_REGISTRO_SPINBUTTON_LABELS =
  cfg.registroPlantaConsumosConceptosOcRegistroSpinbuttonLabels;

/** Flat form field labels for Parametros Regas Nuevo Registro. */
export const REGISTRO_PLANTA_CONSUMOS_PARAMETROS_REGAS_FORM_LABELS =
  cfg.registroPlantaConsumosParametrosRegasFormLabels;

/**
 * Navigation and assertions for the Planta y consumos submodule under Registro.
 */
export class RegistroPlantaConsumosNavigationPage extends RegistroNavigationBasePage {
  /** URL slug segment per Planta y consumos tab (tenant config). */
  static readonly REGISTRO_PLANTA_CONSUMOS_TAB_SLUGS: Record<string, RegExp> = toTabSlugRecord(
    cfg.registroPlantaConsumosTabSlugs,
  );

  /** Breadcrumb third-segment text per active tab. */
  static readonly REGISTRO_PLANTA_CONSUMOS_TAB_BREADCRUMBS: Record<string, string> =
    cfg.registroPlantaConsumosTabBreadcrumbs;

  /**
   * Expands Registro and the Planta y consumos submodule dropdown in the sidebar.
   */
  async expandPlantaConsumosSidebar(): Promise<void> {
    await this.expandRegistroSubmodule('Insumos oferta');
  }

  /**
   * Re-expands Registro and Planta y consumos when navigation collapsed the sidebar flyouts.
   */
  async ensurePlantaConsumosSidebarExpanded(): Promise<void> {
    await this.ensureRegistroSubmoduleNestedLinksVisible('Insumos oferta', 'Oferta Diaria');
  }

  /**
   * Clicks a Planta y consumos tab link inside the expanded sidebar submenu.
   */
  async clickPlantaConsumosSidebarLink(tabName: RegistroPlantaConsumosTabName): Promise<void> {
    await this.ensurePlantaConsumosSidebarExpanded();
    await this.clickRegistroSubmenuLink(tabName);
    await expect(this.page).toHaveURL(
      RegistroPlantaConsumosNavigationPage.REGISTRO_PLANTA_CONSUMOS_TAB_SLUGS[tabName],
      { timeout: 15_000 },
    );
  }

  /**
   * Opens a Planta y consumos tab via sidebar nested links under Planta y consumos.
   */
  async openPlantaConsumosFromSidebar(tabName: RegistroPlantaConsumosTabName): Promise<void> {
    await this.expandPlantaConsumosSidebar();
    await this.clickPlantaConsumosSidebarLink(tabName);
  }

  /**
   * Asserts Planta y consumos is listed on the Registro dashboard hover card with an eye affordance.
   */
  async expectPlantaConsumosVisibleOnDashboardHover(): Promise<void> {
    await this.hoverRegistroDashboardCard();
    const row = this.registroDashboardCard()
      .getByRole('listitem')
      .filter({ hasText: 'Insumos oferta' });
    await expect(row).toBeVisible();
    await expect(row.getByLabel('eye')).toBeVisible();
  }

  /**
   * Asserts enabled tabs and locked tabs on the Planta y consumos gestor shell.
   */
  async expectLockedTabsDisabled(): Promise<void> {
    for (const tabName of REGISTRO_PLANTA_CONSUMOS_LOCKED_TAB_NAMES) {
      const tab = this.page.getByRole('tab', { name: tabName });
      await expect(tab).toBeVisible();
      await expect(tab).toBeDisabled();
    }
  }

  /**
   * Asserts Planta y consumos gestor shell: URL, breadcrumb, and tab strip state.
   */
  async expectGestorDeDatosPlantaConsumosShell(): Promise<void> {
    await expect(this.page).toHaveURL(/gestor-de-datos\/plantas-y-consumos\//);
    const breadcrumb = this.page.getByRole('navigation');
    await expect(breadcrumb).toContainText('Gestor de datos');
    await expect(breadcrumb).toContainText(/Plantas y consumos|Insumos oferta/i);
    for (const tabName of REGISTRO_PLANTA_CONSUMOS_ENABLED_TAB_NAMES) {
      await expect(this.page.getByRole('tab', { name: tabName })).toBeVisible();
      await expect(this.page.getByRole('tab', { name: tabName })).toBeEnabled();
    }
    await this.expectLockedTabsDisabled();
  }

  /**
   * Opens a Planta y consumos tab and asserts selection, breadcrumb, and URL slug.
   */
  async openPlantaConsumosTab(tabName: RegistroPlantaConsumosTabName): Promise<void> {
    await this.page.getByRole('tab', { name: tabName }).click();
    await this.expectPlantaConsumosTabActive(tabName);
  }

  /**
   * Asserts the tab is selected, breadcrumb shows the tab label, and URL matches the slug.
   */
  async expectPlantaConsumosTabActive(tabName: RegistroPlantaConsumosTabName): Promise<void> {
    await expect(this.page).toHaveURL(
      RegistroPlantaConsumosNavigationPage.REGISTRO_PLANTA_CONSUMOS_TAB_SLUGS[tabName],
      { timeout: 15_000 },
    );
    const tab = this.page.getByRole('tab', { name: tabName });
    await expect(tab).toBeVisible();
    await expect(tab).toHaveAttribute('aria-selected', 'true');
    await expect(this.page.getByRole('navigation')).toContainText(
      RegistroPlantaConsumosNavigationPage.REGISTRO_PLANTA_CONSUMOS_TAB_BREADCRUMBS[tabName],
    );
  }

  /**
   * Returns the active tab panel for the given tab label.
   */
  protected activeTabPanel(tabName: RegistroPlantaConsumosTabName): Locator {
    return this.page.getByRole('tabpanel', { name: tabName });
  }

  /**
   * Returns the calendar year combobox in the main content region.
   */
  protected calendarYearCombobox(): Locator {
    return this.gestorMain().getByRole('combobox').first();
  }

  /**
   * Returns the calendar month combobox in the main content region.
   */
  protected calendarMonthCombobox(): Locator {
    return this.gestorMain().getByRole('combobox').nth(1);
  }

  /**
   * Returns the Ant Design select wrapper for the calendar year control.
   */
  protected calendarYearSelect(): Locator {
    return this.calendarYearCombobox().locator('xpath=ancestor::*[contains(@class,"ant-select")]').first();
  }

  /**
   * Returns the Ant Design select wrapper for the calendar month control.
   */
  protected calendarMonthSelect(): Locator {
    return this.calendarMonthCombobox().locator('xpath=ancestor::*[contains(@class,"ant-select")]').first();
  }

  /**
   * Asserts Layout A calendar toolbar: year/month selectors, Mes/Año radios, and primary CTA.
   */
  async expectLayoutACalendarToolbar(
    primaryCta: 'Carga archivo' | 'Nuevo Registro' = 'Carga archivo',
  ): Promise<void> {
    const main = this.gestorMain();
    await expect(this.calendarYearCombobox()).toBeVisible();
    await expect(this.calendarMonthCombobox()).toBeVisible();
    await expect(main.getByText('Mes', { exact: true })).toBeVisible();
    await expect(main.getByText('Año', { exact: true })).toBeVisible();
    await expect(main.getByRole('button', { name: primaryCta })).toBeVisible();
    await this.expectFiltrosControlAbsent();
    await this.expectToolbarFilterChipsAbsent();
  }

  /**
   * Asserts Mes view calendar grid with weekday headers and day cells.
   */
  async expectCalendarMesView(): Promise<void> {
    const table = this.gestorMain().locator('table').filter({ hasText: 'Lun' }).first();
    for (const header of REGISTRO_PLANTA_CONSUMOS_CALENDAR_WEEKDAY_HEADERS) {
      await expect(table.getByRole('columnheader', { name: header, exact: true })).toBeVisible();
    }
    await expect(table.locator('tbody td').first()).toBeVisible();
  }

  /**
   * Asserts Año view calendar grid with twelve month tiles and no weekday headers.
   */
  async expectCalendarAnoView(): Promise<void> {
    const main = this.gestorMain();
    const table = main.locator('table').first();
    for (const month of REGISTRO_PLANTA_CONSUMOS_CALENDAR_ANO_MONTH_CELLS) {
      await expect(table.locator('tbody td').getByText(month, { exact: true })).toBeVisible();
    }
    for (const header of REGISTRO_PLANTA_CONSUMOS_CALENDAR_WEEKDAY_HEADERS) {
      await expect(table.getByRole('columnheader', { name: header, exact: true })).toHaveCount(0);
    }
  }

  /**
   * Opens the calendar year dropdown and validates options; selects the given year.
   */
  async expectCalendarYearDropdownWorks(selectYear = '2025'): Promise<void> {
    const yearCombo = this.calendarYearCombobox();
    await yearCombo.click();
    const dropdown = this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)').last();
    await expect(dropdown).toBeVisible();
    for (const year of REGISTRO_PLANTA_CONSUMOS_CALENDAR_YEAR_OPTIONS) {
      await expect(
        dropdown.locator('.ant-select-item-option-content').getByText(year, { exact: true }),
      ).toBeVisible();
    }
    await dropdown.locator('.ant-select-item-option-content').getByText(selectYear, { exact: true }).click();
    await expect(this.calendarYearSelect()).toContainText(selectYear);
    await expect(this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')).toHaveCount(0);
  }

  /**
   * Opens the calendar month dropdown and validates options; selects the given month.
   */
  async expectCalendarMonthDropdownWorks(selectMonth = 'mar'): Promise<void> {
    const monthCombo = this.calendarMonthCombobox();
    await monthCombo.click();
    const dropdown = this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)').last();
    await expect(dropdown).toBeVisible();
    for (const month of REGISTRO_PLANTA_CONSUMOS_CALENDAR_MONTH_OPTIONS) {
      await expect(
        dropdown.locator('.ant-select-item-option-content').getByText(month, { exact: true }),
      ).toBeVisible();
    }
    await dropdown.locator('.ant-select-item-option-content').getByText(selectMonth, { exact: true }).click();
    await expect(this.calendarMonthSelect()).toContainText(selectMonth);
    await expect(this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')).toHaveCount(0);

    await monthCombo.click();
    await this.page.waitForTimeout(300);
    const scrollDropdown = this.page
      .locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
      .last();
    const scrollHolder = scrollDropdown.locator('.rc-virtual-list-holder');
    if (await scrollHolder.count()) {
      await scrollHolder.evaluate((el) => {
        el.scrollTop = el.scrollHeight;
      });
    }
    for (const month of REGISTRO_PLANTA_CONSUMOS_CALENDAR_MONTH_OPTIONS_SCROLL) {
      await expect(
        scrollDropdown.locator('.ant-select-item-option-content').getByText(month, { exact: true }),
      ).toBeVisible();
    }
    await this.page.keyboard.press('Escape');
  }

  /**
   * Toggles Mes/Año calendar views and validates each layout.
   */
  async expectCalendarMesAnoToggleWorks(): Promise<void> {
    const main = this.gestorMain();
    await main.getByText('Año', { exact: true }).click();
    await this.expectCalendarAnoView();
    await main.getByText('Mes', { exact: true }).click();
    await this.expectCalendarMesView();
  }

  /**
   * Exercises year/month dropdowns and Mes/Año toggle on a Layout A calendar tab.
   */
  async expectCalendarControlsWork(): Promise<void> {
    await this.expectCalendarYearDropdownWorks();
    await this.expectCalendarMonthDropdownWorks();
    await this.expectCalendarMesAnoToggleWorks();
    await this.dismissOpenSelectDropdowns();
    await this.resetGestorToolbarFocus();
  }

  /**
   * Asserts Layout B table toolbar: search, no Filtros, no filter chips, and optional extra CTAs.
   */
  async expectLayoutBTableToolbar(extraButtons: readonly string[] = ['Nuevo Registro']): Promise<void> {
    const main = this.gestorMain();
    await expect(main.getByRole('searchbox', { name: /Buscar/i })).toBeVisible();
    await this.expectFiltrosControlAbsent();
    await this.expectToolbarFilterChipsAbsent();
    for (const buttonName of extraButtons) {
      await expect(main.getByRole('button', { name: buttonName })).toBeVisible();
    }
  }

  /**
   * Asserts data-table column headers in the first main grid.
   */
  async expectGridColumnHeaders(columnNames: readonly string[]): Promise<void> {
    const table = this.gestorMain().getByRole('table').first();
    await assertTableColumnHeadersMatchConfig(table, columnNames);
  }

  /**
   * Asserts Registrar Información file-upload dialog content, then closes it.
   */
  async expectFileUploadDialog(options?: { withTemplate?: boolean }): Promise<void> {
    const dialog = this.page.getByRole('dialog').filter({ hasText: 'Registrar Información' }).last();
    await expect(dialog).toBeVisible({ timeout: 15_000 });
    await expect(dialog).toContainText(/archivos Excel \(\.xlsx\)/i);
    await expect(dialog.getByRole('button', { name: 'Guardar' })).toBeVisible();
    if (options?.withTemplate) {
      await expect(dialog.getByRole('button', { name: 'Descargar plantilla' })).toBeVisible();
    }
    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).not.toBeVisible({ timeout: 10_000 });
    await this.expectNoVisibleModals();
  }

  /**
   * Clicks a CTA, opens file-upload dialog, validates, and closes.
   */
  async expectFileUploadDialogOpensAndCloses(
    buttonName: string | RegExp,
    options?: { withTemplate?: boolean },
  ): Promise<void> {
    await this.openRegistrarInformacionDialog(buttonName);
    await this.expectFileUploadDialog(options);
  }

  /**
   * Asserts a single-step flat form dialog with visible field labels, then closes it.
   */
  async expectFlatFormDialogOpensAndCloses(
    buttonName: string | RegExp,
    fieldLabels: readonly string[],
  ): Promise<void> {
    const dialog = await this.openRegistrarInformacionDialog(buttonName);
    const fields: RegistroWizardFieldDefinition[] = fieldLabels.map((label) => ({
      label,
      kind: 'textbox',
    }));
    await assertRegistroWizardFieldsMatchConfig(dialog, fields);
    for (const label of fieldLabels) {
      await expect(dialog.locator('.ant-form-item-label').filter({ hasText: label }).first()).toBeVisible();
    }
    await expect(dialog.getByRole('button', { name: 'Limpiar' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Guardar' })).toBeVisible();
    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).not.toBeVisible({ timeout: 10_000 });
    await this.dismissOpenSelectDropdowns();
    await this.expectNoVisibleModals();
  }

  /**
   * Opens Heat Rate Nuevo Registro, validates step-1 fields and dropdowns, then closes.
   */
  async expectHeatRateWizardDialog(): Promise<void> {
    await this.expectNoVisibleModals();
    await this.gestorMain().getByRole('button', { name: 'Nuevo Registro' }).click();

    const dialog = this.registroWizardDialog(/Nuevo Heat Rate/i);
    await expect(dialog).toBeVisible({ timeout: 15_000 });
    await expect(dialog).toContainText('Registrar Información');
    for (const step of REGISTRO_PLANTA_CONSUMOS_HEAT_RATE_NUEVO_REGISTRO_WIZARD_STEPS) {
      await expect(dialog.getByText(step, { exact: true })).toBeVisible();
    }

    await assertRegistroWizardFieldsMatchConfig(
      dialog,
      REGISTRO_PLANTA_CONSUMOS_HEAT_RATE_NUEVO_REGISTRO_FIELDS,
    );

    for (const field of REGISTRO_PLANTA_CONSUMOS_HEAT_RATE_NUEVO_REGISTRO_FIELDS) {
      await this.expectRegistroWizardField(
        dialog,
        field,
        REGISTRO_PLANTA_CONSUMOS_HEAT_RATE_WIZARD_DROPDOWN_OPTIONS,
        REGISTRO_WIZARD_FIELD_ASSERT_COMBUSTIBLE,
      );
    }

    const configCombo = dialog.getByRole('combobox').nth(2);
    if (await configCombo.isVisible()) {
      await configCombo.click();
      const dropdown = this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)').last();
      await expect(dropdown.locator('.ant-select-item-option').first()).toBeVisible();
      await this.dismissOpenWizardSelectDropdown(dialog, 'heading-click');
    }

    await expect(dialog.getByRole('button', { name: 'Cancelar' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: /Siguiente/i })).toBeDisabled();
    await expect(dialog.getByRole('button', { name: 'Limpiar' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Guardar' })).toBeVisible();

    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).not.toBeVisible({ timeout: 10_000 });
    await this.expectNoVisibleModals();
  }

  /**
   * Opens OEF Proyectada Nuevo Registro, validates wizard fields, then closes.
   */
  async expectOefProyectadaWizardDialog(): Promise<void> {
    await this.expectRegistroWizardDialogOpensAndCloses({
      ctaName: 'Nuevo Registro',
      stepTitle: /Nueva Vigencia Oef/i,
      wizardSteps: REGISTRO_PLANTA_CONSUMOS_OEF_NUEVO_REGISTRO_WIZARD_STEPS,
      fields: REGISTRO_PLANTA_CONSUMOS_OEF_NUEVO_REGISTRO_FIELDS,
      dropdownOptions: REGISTRO_PLANTA_CONSUMOS_OEF_WIZARD_DROPDOWN_OPTIONS,
      fieldAssertOptions: REGISTRO_WIZARD_FIELD_ASSERT_ENERGIA,
    });
  }

  /**
   * Opens Nuevo Concepto form, validates fields and Unidad dropdown, then closes.
   */
  async expectNuevoConceptoDialog(): Promise<void> {
    await this.expectFlatFormDialogWithComboboxOpensAndCloses(
      'Nuevo Concepto',
      REGISTRO_PLANTA_CONSUMOS_CONCEPTO_FORM_FIELDS,
      { Unidad: [...REGISTRO_PLANTA_CONSUMOS_CONCEPTO_UNIDAD_OPTIONS] },
      { requiredDialogText: 'Nombre Concepto' },
    );
  }

  /**
   * Opens Conceptos OC Nuevo Registro, validates fields and Concepto dropdown, then closes.
   */
  async expectConceptosOcRegistroDialog(): Promise<void> {
    await this.expectFlatFormDialogWithComboboxOpensAndCloses(
      'Nuevo Registro',
      REGISTRO_PLANTA_CONSUMOS_CONCEPTOS_OC_REGISTRO_FIELDS,
      REGISTRO_PLANTA_CONSUMOS_CONCEPTOS_OC_REGISTRO_DROPDOWN_OPTIONS,
      {
        extraExpectedLabels: REGISTRO_PLANTA_CONSUMOS_CONCEPTOS_OC_REGISTRO_SPINBUTTON_LABELS,
        spinbuttonLabels: REGISTRO_PLANTA_CONSUMOS_CONCEPTOS_OC_REGISTRO_SPINBUTTON_LABELS,
      },
    );
  }

  /**
   * Opens Gestion Conceptos Nuevo Registro, validates concept form fields, then closes.
   */
  async expectGestionConceptosRegistroDialog(): Promise<void> {
    await this.expectFlatFormDialogWithComboboxOpensAndCloses(
      'Nuevo Registro',
      REGISTRO_PLANTA_CONSUMOS_CONCEPTO_FORM_FIELDS,
      { Unidad: [...REGISTRO_PLANTA_CONSUMOS_CONCEPTO_UNIDAD_OPTIONS] },
    );
  }

  /**
   * Opens a flat-form CTA, validates labels and combobox dropdowns, then closes the dialog.
   */
  async expectFlatFormDialogWithComboboxOpensAndCloses(
    buttonName: string | RegExp,
    fields: readonly RegistroWizardFieldDefinition[],
    dropdownOptions: RegistroWizardDropdownOptionsMap,
    options?: {
      requiredDialogText?: string;
      extraExpectedLabels?: readonly string[];
      spinbuttonLabels?: readonly string[];
    },
  ): Promise<void> {
    const dialog = await this.openRegistrarInformacionDialog(buttonName);
    await expect(dialog).toContainText('Registrar Información');
    if (options?.requiredDialogText) {
      await expect(
        dialog.locator('.ant-form-item-label').filter({ hasText: options.requiredDialogText }).first(),
      ).toBeVisible();
    }
    await assertRegistroWizardFieldsMatchConfig(dialog, fields, {
      extraExpectedLabels: options?.extraExpectedLabels,
    });
    for (const field of fields) {
      await this.expectRegistroWizardField(
        dialog,
        field,
        dropdownOptions,
        REGISTRO_WIZARD_FIELD_ASSERT_COMBUSTIBLE,
      );
    }
    if (options?.spinbuttonLabels?.length) {
      for (const label of options.spinbuttonLabels) {
        const spinbutton = dialog.getByRole('spinbutton', { name: `* ${label}`, exact: true });
        await expect(spinbutton).toBeVisible();
      }
    }
    await expect(dialog.getByRole('button', { name: 'Limpiar' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Guardar' })).toBeVisible();
    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).not.toBeVisible({ timeout: 10_000 });
    await this.dismissOpenSelectDropdowns();
    await this.expectNoVisibleModals();
  }

  /**
   * Opens Cargar Archivo flat form on Parametros Regas, validates fields, then closes.
   */
  async expectParametrosRegasCargarArchivoDialog(): Promise<void> {
    await this.expectFlatFormDialogOpensAndCloses(
      'Cargar Archivo',
      REGISTRO_PLANTA_CONSUMOS_PARAMETROS_REGAS_FORM_LABELS,
    );
  }
}
