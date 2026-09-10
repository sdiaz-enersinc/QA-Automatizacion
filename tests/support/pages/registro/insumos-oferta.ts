import { expect, Locator } from '@playwright/test';
import {
  getRegistroInsumosOfertaConfig,
  getModuleEnabledTabNames,
  isModuleEnabled,
  toTabSlugRecord,
} from '../../config/load-tenant-config';
import { MODULE_IDS } from '../../config/module-registry';
import type { RegistroInsumosOfertaTabName } from '../../config/types/registro-insumos-oferta';
import {
  REGISTRO_WIZARD_FIELD_ASSERT_COMBUSTIBLE,
  REGISTRO_WIZARD_FIELD_ASSERT_ENERGIA,
  RegistroNavigationBasePage,
  type RegistroWizardDropdownOptionsMap,
  type RegistroWizardFieldDefinition,
} from './registro-navigation-base';
import { assertRegistroWizardFieldsMatchConfig } from '../../registro/form-field-labels';
import { assertTableColumnHeadersMatchConfig } from '../../registro/table-column-headers';

export type { RegistroInsumosOfertaTabName };

const cfg = getRegistroInsumosOfertaConfig();

/** Whether the Registro Insumos oferta module is enabled for the active tenant. */
export const REGISTRO_INSUMOS_OFERTA_ENABLED = isModuleEnabled(MODULE_IDS.registroInsumosOferta);

/** Visible submenu label for Insumos oferta (tenant config). */
export const REGISTRO_INSUMOS_OFERTA_SUBMODULE_LABEL = cfg.registroInsumosOfertaSubmoduleLabel;

/** Legacy submenu label that must not appear after the rename. */
export const REGISTRO_INSUMOS_OFERTA_LEGACY_SUBMODULE_LABEL =
  cfg.registroInsumosOfertaLegacySubmoduleLabel;

/** Legacy breadcrumb second segment still shown in the gestor shell. */
export const REGISTRO_INSUMOS_OFERTA_LEGACY_BREADCRUMB = cfg.registroInsumosOfertaLegacyBreadcrumb;

/** Exact UI label for the locked Recursos Generción (AGR) tab and sidebar row. */
export const REGISTRO_INSUMOS_OFERTA_AGR_LABEL = cfg.registroInsumosOfertaAgrLabel;

/** Labels that must be absent from sidebar and tab strip (e.g. Heat Rate). */
export const REGISTRO_INSUMOS_OFERTA_ABSENT_LABELS = cfg.registroInsumosOfertaAbsentLabels;

/** Tab and nested-sidebar labels in UI order (includes AGR). */
export const REGISTRO_INSUMOS_OFERTA_TAB_NAMES = cfg.registroInsumosOfertaTabNames;

/** Nested sidebar labels (alias of tab names; AGR first). */
export const REGISTRO_INSUMOS_OFERTA_NESTED_SIDEBAR_LABELS = REGISTRO_INSUMOS_OFERTA_TAB_NAMES;

/** Tabs reachable with current tenant credentials. */
export const REGISTRO_INSUMOS_OFERTA_ENABLED_TAB_NAMES = getModuleEnabledTabNames(
  MODULE_IDS.registroInsumosOferta,
);

/** Enabled nested sidebar links (alias of enabled tab names). */
export const REGISTRO_INSUMOS_OFERTA_ENABLED_NESTED_LABELS = REGISTRO_INSUMOS_OFERTA_ENABLED_TAB_NAMES;

/** Locked tab and nested-sidebar labels (includes AGR). */
export const REGISTRO_INSUMOS_OFERTA_LOCKED_TAB_NAMES = cfg.registroInsumosOfertaLockedTabNames;

/** Locked nested sidebar menuitems (alias of locked tab names). */
export const REGISTRO_INSUMOS_OFERTA_LOCKED_NESTED_LABELS = REGISTRO_INSUMOS_OFERTA_LOCKED_TAB_NAMES;

/** Default enabled tab used as sidebar anchor and landing view. */
export const REGISTRO_INSUMOS_OFERTA_DEFAULT_TAB = REGISTRO_INSUMOS_OFERTA_ENABLED_TAB_NAMES[0];

/** Calendar weekday column headers (Mes view). */
export const REGISTRO_INSUMOS_OFERTA_CALENDAR_WEEKDAY_HEADERS =
  cfg.registroInsumosOfertaCalendarWeekdayHeaders;

/** Calendar month tile labels (Año view). */
export const REGISTRO_INSUMOS_OFERTA_CALENDAR_ANO_MONTH_CELLS =
  cfg.registroInsumosOfertaCalendarAnoMonthCells;

/** Expected year options in calendar year dropdown. */
export const REGISTRO_INSUMOS_OFERTA_CALENDAR_YEAR_OPTIONS =
  cfg.registroInsumosOfertaCalendarYearOptions;

/** Expected month options visible without scroll in calendar month dropdown. */
export const REGISTRO_INSUMOS_OFERTA_CALENDAR_MONTH_OPTIONS =
  cfg.registroInsumosOfertaCalendarMonthOptions;

/** Additional month options reachable by scrolling the month dropdown. */
export const REGISTRO_INSUMOS_OFERTA_CALENDAR_MONTH_OPTIONS_SCROLL =
  cfg.registroInsumosOfertaCalendarMonthOptionsScroll;

/** OEF Proyectada grid column headers (Layout B). */
export const REGISTRO_INSUMOS_OFERTA_OEF_PROYECTADA_COLUMNS =
  cfg.registroInsumosOfertaOefProyectadaColumns;

/** Conceptos OC grid column headers (Layout B). */
export const REGISTRO_INSUMOS_OFERTA_CONCEPTOS_OC_COLUMNS =
  cfg.registroInsumosOfertaConceptosOcColumns;

/** Gestion Conceptos grid column headers (Layout B). */
export const REGISTRO_INSUMOS_OFERTA_GESTION_CONCEPTOS_COLUMNS =
  cfg.registroInsumosOfertaGestionConceptosColumns;

/** Wizard step titles for OEF Proyectada Nuevo Registro. */
export const REGISTRO_INSUMOS_OFERTA_OEF_NUEVO_REGISTRO_WIZARD_STEPS =
  cfg.registroInsumosOfertaOefNuevoRegistroWizardSteps;

/** Expected dropdown options per OEF Proyectada wizard combobox. */
export const REGISTRO_INSUMOS_OFERTA_OEF_WIZARD_DROPDOWN_OPTIONS: RegistroWizardDropdownOptionsMap =
  cfg.registroInsumosOfertaOefWizardDropdownOptions;

/** Shared Unidad options for concept forms. */
export const REGISTRO_INSUMOS_OFERTA_CONCEPTO_UNIDAD_OPTIONS =
  cfg.registroInsumosOfertaConceptoUnidadOptions;

/** Expected dropdown options for Conceptos OC Nuevo Registro. */
export const REGISTRO_INSUMOS_OFERTA_CONCEPTOS_OC_REGISTRO_DROPDOWN_OPTIONS: RegistroWizardDropdownOptionsMap =
  cfg.registroInsumosOfertaConceptosOcRegistroDropdownOptions;

/** Step-1 form fields for OEF Proyectada Nuevo Registro. */
export const REGISTRO_INSUMOS_OFERTA_OEF_NUEVO_REGISTRO_FIELDS: readonly RegistroWizardFieldDefinition[] =
  cfg.registroInsumosOfertaOefNuevoRegistroFields;

/** Form fields for Nuevo Concepto / Gestion Conceptos Nuevo Registro. */
export const REGISTRO_INSUMOS_OFERTA_CONCEPTO_FORM_FIELDS: readonly RegistroWizardFieldDefinition[] =
  cfg.registroInsumosOfertaConceptoFormFields;

/** Form fields for Conceptos OC Nuevo Registro. */
export const REGISTRO_INSUMOS_OFERTA_CONCEPTOS_OC_REGISTRO_FIELDS: readonly RegistroWizardFieldDefinition[] =
  cfg.registroInsumosOfertaConceptosOcRegistroFields;

/** Spinbutton labels for Conceptos OC Nuevo Registro (not modeled as wizard field kinds). */
export const REGISTRO_INSUMOS_OFERTA_CONCEPTOS_OC_REGISTRO_SPINBUTTON_LABELS =
  cfg.registroInsumosOfertaConceptosOcRegistroSpinbuttonLabels;

/**
 * Navigation and assertions for the Insumos oferta submodule under Registro.
 */
export class RegistroInsumosOfertaNavigationPage extends RegistroNavigationBasePage {
  /** URL slug segment per navigable Insumos oferta tab (tenant config). */
  static readonly REGISTRO_INSUMOS_OFERTA_TAB_SLUGS: Record<string, RegExp> = toTabSlugRecord(
    cfg.registroInsumosOfertaTabSlugs,
  );

  /** Breadcrumb third-segment text per active tab. */
  static readonly REGISTRO_INSUMOS_OFERTA_TAB_BREADCRUMBS: Record<string, string> =
    cfg.registroInsumosOfertaTabBreadcrumbs;

  /** Href of each enabled nested sidebar link (tenant config). */
  static readonly REGISTRO_INSUMOS_OFERTA_SIDEBAR_HREFS: Record<string, string> =
    cfg.registroInsumosOfertaSidebarHrefs;

  /**
   * Expands Registro and the Insumos oferta submodule dropdown in the sidebar.
   */
  async expandInsumosOfertaSidebar(): Promise<void> {
    await this.expandRegistroSubmodule(REGISTRO_INSUMOS_OFERTA_SUBMODULE_LABEL);
  }

  /**
   * Re-expands Registro and Insumos oferta when navigation collapsed the sidebar flyouts.
   */
  async ensureInsumosOfertaSidebarExpanded(): Promise<void> {
    await this.ensureRegistroSubmoduleNestedLinksVisible(
      REGISTRO_INSUMOS_OFERTA_SUBMODULE_LABEL,
      REGISTRO_INSUMOS_OFERTA_DEFAULT_TAB,
    );
  }

  /**
   * Clicks an Insumos oferta tab link inside the expanded sidebar submenu.
   *
   * @param tabName - Enabled nested sidebar link label.
   */
  async clickInsumosOfertaSidebarLink(tabName: RegistroInsumosOfertaTabName): Promise<void> {
    await this.ensureInsumosOfertaSidebarExpanded();
    await this.clickRegistroSubmenuLink(tabName);
    await expect(this.page).toHaveURL(
      RegistroInsumosOfertaNavigationPage.REGISTRO_INSUMOS_OFERTA_TAB_SLUGS[tabName],
      { timeout: 15_000 },
    );
  }

  /**
   * Opens an Insumos oferta tab via sidebar nested links under Insumos oferta.
   *
   * @param tabName - Enabled nested sidebar link label.
   */
  async openInsumosOfertaFromSidebar(tabName: RegistroInsumosOfertaTabName): Promise<void> {
    await this.expandInsumosOfertaSidebar();
    await this.clickInsumosOfertaSidebarLink(tabName);
  }

  /**
   * Asserts Insumos oferta is listed on the Registro dashboard hover card and the legacy name is absent.
   */
  async expectInsumosOfertaVisibleOnDashboardHover(): Promise<void> {
    await this.hoverRegistroDashboardCard();
    const card = this.registroDashboardCard();
    const row = card.getByRole('listitem').filter({ hasText: REGISTRO_INSUMOS_OFERTA_SUBMODULE_LABEL });
    await expect(row).toBeVisible();
    await expect(row.getByLabel('eye')).toBeVisible();
    await expect(card.getByText(REGISTRO_INSUMOS_OFERTA_LEGACY_SUBMODULE_LABEL, { exact: true })).toHaveCount(
      0,
    );
  }

  /**
   * Asserts Insumos oferta is present in the Registro submenu and the legacy label is absent.
   */
  async expectInsumosOfertaSubmenuPresentAndLegacyAbsent(): Promise<void> {
    await this.expandRegistroSidebar();
    const submenu = this.registroSubmenu();
    await expect(
      submenu.getByRole('menuitem', { name: REGISTRO_INSUMOS_OFERTA_SUBMODULE_LABEL, disabled: false }),
    ).toBeVisible();
    await expect(
      submenu.getByRole('menuitem', { name: REGISTRO_INSUMOS_OFERTA_LEGACY_SUBMODULE_LABEL }),
    ).toHaveCount(0);
  }

  /**
   * Asserts nested Insumos oferta sidebar items: AGR first and locked, enabled links, locked menuitems, Heat Rate absent.
   */
  async expectInsumosOfertaNestedSidebarItems(): Promise<void> {
    await this.expandInsumosOfertaSidebar();
    const submenu = this.registroSubmenu();
    const nestedItems = submenu.locator('[role=menu]').first().getByRole('menuitem');
    await expect(nestedItems.first()).toContainText(REGISTRO_INSUMOS_OFERTA_AGR_LABEL);
    await expect(
      submenu.getByRole('menuitem', { name: REGISTRO_INSUMOS_OFERTA_AGR_LABEL, disabled: true }),
    ).toBeVisible();
    for (const label of REGISTRO_INSUMOS_OFERTA_ENABLED_NESTED_LABELS) {
      await expect(submenu.getByRole('link', { name: label })).toBeVisible();
    }
    for (const label of REGISTRO_INSUMOS_OFERTA_LOCKED_NESTED_LABELS) {
      await expect(submenu.getByRole('menuitem', { name: label, disabled: true })).toBeVisible();
    }
    await expect(nestedItems).toHaveCount(REGISTRO_INSUMOS_OFERTA_NESTED_SIDEBAR_LABELS.length);
    await this.expectHeatRateAbsentFromSidebar();
  }

  /**
   * Asserts enabled nested sidebar links expose the expected hrefs from tenant config.
   */
  async expectInsumosOfertaEnabledSidebarHrefs(): Promise<void> {
    await this.expandInsumosOfertaSidebar();
    const submenu = this.registroSubmenu();
    for (const [label, href] of Object.entries(
      RegistroInsumosOfertaNavigationPage.REGISTRO_INSUMOS_OFERTA_SIDEBAR_HREFS,
    )) {
      await expect(submenu.getByRole('link', { name: label })).toHaveAttribute('href', href);
    }
  }

  /**
   * Asserts Heat Rate is absent from the Registro submenu.
   */
  async expectHeatRateAbsentFromSidebar(): Promise<void> {
    const submenu = this.registroSubmenu();
    for (const label of REGISTRO_INSUMOS_OFERTA_ABSENT_LABELS) {
      await expect(submenu.getByRole('menuitem', { name: label })).toHaveCount(0);
    }
  }

  /**
   * Asserts Heat Rate is absent from the gestor tab strip.
   */
  async expectHeatRateAbsentFromTabs(): Promise<void> {
    for (const label of REGISTRO_INSUMOS_OFERTA_ABSENT_LABELS) {
      await expect(this.page.getByRole('tab', { name: label })).toHaveCount(0);
    }
  }

  /**
   * Asserts Heat Rate is absent from both the sidebar and the tab strip.
   */
  async expectHeatRateAbsent(): Promise<void> {
    await this.expectHeatRateAbsentFromSidebar();
    await this.expectHeatRateAbsentFromTabs();
  }

  /**
   * Asserts the banner breadcrumb still shows the legacy Plantas y consumos segment, not Insumos oferta.
   */
  async expectLegacyPlantasYConsumosBreadcrumb(): Promise<void> {
    const breadcrumb = this.page.getByRole('banner').getByRole('navigation');
    await expect(breadcrumb).toContainText(REGISTRO_INSUMOS_OFERTA_LEGACY_BREADCRUMB);
    await expect(breadcrumb).not.toContainText(REGISTRO_INSUMOS_OFERTA_SUBMODULE_LABEL);
  }

  /**
   * Asserts Recursos Generción (AGR) is the first tab and is disabled.
   */
  async expectAgrTabLocked(): Promise<void> {
    const agrTab = this.page.getByRole('tab', { name: REGISTRO_INSUMOS_OFERTA_AGR_LABEL });
    await expect(this.page.getByRole('tab').first()).toHaveText(REGISTRO_INSUMOS_OFERTA_AGR_LABEL);
    await expect(agrTab).toBeVisible();
    await expect(agrTab).toBeDisabled();
  }

  /**
   * Asserts a forced click on Recursos Generción (AGR) does not navigate or open a dialog.
   */
  async expectAgrTabDoesNotNavigate(): Promise<void> {
    const agrTab = this.page.getByRole('tab', { name: REGISTRO_INSUMOS_OFERTA_AGR_LABEL });
    await agrTab.click({ force: true });
    await expect(this.page).toHaveURL(
      RegistroInsumosOfertaNavigationPage.REGISTRO_INSUMOS_OFERTA_TAB_SLUGS[
        REGISTRO_INSUMOS_OFERTA_DEFAULT_TAB
      ],
    );
    await expect(
      this.page.getByRole('tab', { name: REGISTRO_INSUMOS_OFERTA_DEFAULT_TAB }),
    ).toHaveAttribute('aria-selected', 'true');
    await expect(this.page.getByRole('dialog')).toHaveCount(0);
  }

  /**
   * Asserts locked tabs on the Insumos oferta gestor shell are visible and disabled.
   */
  async expectLockedTabsDisabled(): Promise<void> {
    for (const tabName of REGISTRO_INSUMOS_OFERTA_LOCKED_TAB_NAMES) {
      const tab = this.page.getByRole('tab', { name: tabName });
      await expect(tab).toBeVisible();
      await expect(tab).toBeDisabled();
    }
  }

  /**
   * Asserts Insumos oferta gestor shell: URL, legacy breadcrumb, and tab strip state.
   */
  async expectGestorDeDatosInsumosOfertaShell(): Promise<void> {
    await expect(this.page).toHaveURL(/gestor-de-datos\/plantas-y-consumos\//);
    const breadcrumb = this.page.getByRole('navigation');
    await expect(breadcrumb).toContainText('Gestor de datos');
    await expect(breadcrumb).toContainText(REGISTRO_INSUMOS_OFERTA_LEGACY_BREADCRUMB);
    for (const tabName of REGISTRO_INSUMOS_OFERTA_ENABLED_TAB_NAMES) {
      await expect(this.page.getByRole('tab', { name: tabName })).toBeVisible();
      await expect(this.page.getByRole('tab', { name: tabName })).toBeEnabled();
    }
    await this.expectLockedTabsDisabled();
  }

  /**
   * Opens an Insumos oferta tab and asserts selection, breadcrumb, and URL slug.
   *
   * @param tabName - Enabled tab label.
   */
  async openInsumosOfertaTab(tabName: RegistroInsumosOfertaTabName): Promise<void> {
    await this.page.getByRole('tab', { name: tabName }).click();
    await this.expectInsumosOfertaTabActive(tabName);
  }

  /**
   * Asserts the tab is selected, breadcrumb shows the tab label, and URL matches the slug.
   *
   * @param tabName - Enabled tab label.
   */
  async expectInsumosOfertaTabActive(tabName: RegistroInsumosOfertaTabName): Promise<void> {
    await expect(this.page).toHaveURL(
      RegistroInsumosOfertaNavigationPage.REGISTRO_INSUMOS_OFERTA_TAB_SLUGS[tabName],
      { timeout: 15_000 },
    );
    const tab = this.page.getByRole('tab', { name: tabName });
    await expect(tab).toBeVisible();
    await expect(tab).toHaveAttribute('aria-selected', 'true');
    await expect(this.page.getByRole('navigation')).toContainText(
      RegistroInsumosOfertaNavigationPage.REGISTRO_INSUMOS_OFERTA_TAB_BREADCRUMBS[tabName],
    );
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
   *
   * @param primaryCta - Visible primary action on the calendar toolbar.
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
    for (const header of REGISTRO_INSUMOS_OFERTA_CALENDAR_WEEKDAY_HEADERS) {
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
    for (const month of REGISTRO_INSUMOS_OFERTA_CALENDAR_ANO_MONTH_CELLS) {
      await expect(table.locator('tbody td').getByText(month, { exact: true })).toBeVisible();
    }
    for (const header of REGISTRO_INSUMOS_OFERTA_CALENDAR_WEEKDAY_HEADERS) {
      await expect(table.getByRole('columnheader', { name: header, exact: true })).toHaveCount(0);
    }
  }

  /**
   * Opens the calendar year dropdown and validates options; selects the given year.
   *
   * @param selectYear - Year option to select after listing all years.
   */
  async expectCalendarYearDropdownWorks(selectYear = '2025'): Promise<void> {
    const yearCombo = this.calendarYearCombobox();
    await yearCombo.click();
    const dropdown = this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)').last();
    await expect(dropdown).toBeVisible();
    for (const year of REGISTRO_INSUMOS_OFERTA_CALENDAR_YEAR_OPTIONS) {
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
   *
   * @param selectMonth - Month option to select after listing visible months.
   */
  async expectCalendarMonthDropdownWorks(selectMonth = 'mar'): Promise<void> {
    const monthCombo = this.calendarMonthCombobox();
    await monthCombo.click();
    const dropdown = this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)').last();
    await expect(dropdown).toBeVisible();
    for (const month of REGISTRO_INSUMOS_OFERTA_CALENDAR_MONTH_OPTIONS) {
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
    for (const month of REGISTRO_INSUMOS_OFERTA_CALENDAR_MONTH_OPTIONS_SCROLL) {
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
   *
   * @param extraButtons - Extra toolbar button names expected besides search.
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
   *
   * @param columnNames - Expected column header labels in order.
   */
  async expectGridColumnHeaders(columnNames: readonly string[]): Promise<void> {
    const table = this.gestorMain().getByRole('table').first();
    await assertTableColumnHeadersMatchConfig(table, columnNames);
  }

  /**
   * Opens OEF Proyectada Nuevo Registro, validates wizard fields, then closes.
   */
  async expectOefProyectadaWizardDialog(): Promise<void> {
    await this.expectRegistroWizardDialogOpensAndCloses({
      ctaName: 'Nuevo Registro',
      stepTitle: /Nueva Vigencia Oef/i,
      wizardSteps: REGISTRO_INSUMOS_OFERTA_OEF_NUEVO_REGISTRO_WIZARD_STEPS,
      fields: REGISTRO_INSUMOS_OFERTA_OEF_NUEVO_REGISTRO_FIELDS,
      dropdownOptions: REGISTRO_INSUMOS_OFERTA_OEF_WIZARD_DROPDOWN_OPTIONS,
      fieldAssertOptions: REGISTRO_WIZARD_FIELD_ASSERT_ENERGIA,
    });
  }

  /**
   * Opens Nuevo Concepto form, validates fields and Unidad dropdown, then closes.
   */
  async expectNuevoConceptoDialog(): Promise<void> {
    await this.expectFlatFormDialogWithComboboxOpensAndCloses(
      'Nuevo Concepto',
      REGISTRO_INSUMOS_OFERTA_CONCEPTO_FORM_FIELDS,
      { Unidad: [...REGISTRO_INSUMOS_OFERTA_CONCEPTO_UNIDAD_OPTIONS] },
      { requiredDialogText: 'Nombre Concepto' },
    );
  }

  /**
   * Opens Conceptos OC Nuevo Registro, validates fields and Concepto dropdown, then closes.
   */
  async expectConceptosOcRegistroDialog(): Promise<void> {
    await this.expectFlatFormDialogWithComboboxOpensAndCloses(
      'Nuevo Registro',
      REGISTRO_INSUMOS_OFERTA_CONCEPTOS_OC_REGISTRO_FIELDS,
      REGISTRO_INSUMOS_OFERTA_CONCEPTOS_OC_REGISTRO_DROPDOWN_OPTIONS,
      {
        extraExpectedLabels: REGISTRO_INSUMOS_OFERTA_CONCEPTOS_OC_REGISTRO_SPINBUTTON_LABELS,
        spinbuttonLabels: REGISTRO_INSUMOS_OFERTA_CONCEPTOS_OC_REGISTRO_SPINBUTTON_LABELS,
      },
    );
  }

  /**
   * Opens Gestion Conceptos Nuevo Registro, validates concept form fields, then closes.
   */
  async expectGestionConceptosRegistroDialog(): Promise<void> {
    await this.expectFlatFormDialogWithComboboxOpensAndCloses(
      'Nuevo Registro',
      REGISTRO_INSUMOS_OFERTA_CONCEPTO_FORM_FIELDS,
      { Unidad: [...REGISTRO_INSUMOS_OFERTA_CONCEPTO_UNIDAD_OPTIONS] },
    );
  }

  /**
   * Opens a flat-form CTA, validates labels and combobox dropdowns, then closes the dialog.
   *
   * @param buttonName - Toolbar button that opens Registrar Información.
   * @param fields - Wizard field definitions from tenant config.
   * @param dropdownOptions - Expected combobox options keyed by field label.
   * @param options - Optional extra labels and spinbuttons.
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
}
