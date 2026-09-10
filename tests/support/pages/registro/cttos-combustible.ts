import { expect } from '@playwright/test';
import {
  getRegistroCttosCombustibleConfig,
  getModuleEnabledTabNames,
  isModuleEnabled,
  toTabSlugRecord,
} from '../../config/load-tenant-config';
import { MODULE_IDS } from '../../config/module-registry';
import type { RegistroCttosCombustibleTabName } from '../../config/types/registro-cttos-combustible';
import { assertTableColumnHeadersMatchConfig } from '../../registro/table-column-headers';
import {
  REGISTRO_WIZARD_FIELD_ASSERT_COMBUSTIBLE,
  RegistroNavigationBasePage,
  type RegistroWizardDropdownOptionsMap,
  type RegistroWizardFieldDefinition,
  type RegistroWizardFieldKind,
} from './registro-navigation-base';

export type CombustibleWizardFieldKind = RegistroWizardFieldKind;
export type CombustibleWizardFieldDefinition = RegistroWizardFieldDefinition;
export type CombustibleWizardDropdownOptionsMap = RegistroWizardDropdownOptionsMap;
export type { RegistroCttosCombustibleTabName };

const cfg = getRegistroCttosCombustibleConfig();

/** Whether the Registro Contratos combustible module is enabled for the active tenant. */
export const REGISTRO_CTTS_COMBUSTIBLE_ENABLED = isModuleEnabled(MODULE_IDS.registroCttosCombustible);

/** Tab labels on the Contratos combustible module (tenant config). */
export const REGISTRO_CTTS_COMBUSTIBLE_TAB_NAMES = cfg.registroCttosCombustibleTabNames;

/** Tabs reachable with current tenant credentials. */
export const REGISTRO_CTTS_COMBUSTIBLE_ENABLED_TAB_NAMES = getModuleEnabledTabNames(
  MODULE_IDS.registroCttosCombustible,
);

export const REGISTRO_CTTS_COMBUSTIBLE_LOCKED_TAB_NAMES =
  cfg.registroCttosCombustibleLockedTabNames;

/** Landing tab used as sidebar anchor, seed, and post-Inventarios recovery. */
export const REGISTRO_CTTS_COMBUSTIBLE_DEFAULT_TAB = cfg.registroCttosCombustibleDefaultTab;

/** Layout A tab (Transporte grid with Select all and Carga Ramales). */
export const REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_A_TAB = cfg.registroCttosCombustibleLayoutATab;

/** Layout B tab (Suministro grid without Select all). */
export const REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_B_TAB = cfg.registroCttosCombustibleLayoutBTab;

/** Layout C tab (Inventarios; currently a 404 empty state in QA). */
export const REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_C_TAB = cfg.registroCttosCombustibleLayoutCTab;

/** First locked tab (Insumos); used by the locked-tab spec. */
export const REGISTRO_CTTS_COMBUSTIBLE_LOCKED_TAB = REGISTRO_CTTS_COMBUSTIBLE_LOCKED_TAB_NAMES[0];

/** One tab per layout family for Path B spot-checks. */
export const REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_SPOT_CHECK_TABS = [
  REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_A_TAB,
  REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_B_TAB,
  REGISTRO_CTTS_COMBUSTIBLE_LAYOUT_C_TAB,
] as const;

/** Transporte grid column headers (Layout A, excluding Select all and Acciones). */
export const REGISTRO_CTTS_COMBUSTIBLE_TRANSPORTE_COLUMNS =
  cfg.registroCttosCombustibleTransporteColumns;

/** Suministro grid column headers (Layout B, excluding Acciones). */
export const REGISTRO_CTTS_COMBUSTIBLE_SUMINISTRO_COLUMNS =
  cfg.registroCttosCombustibleSuministroColumns;

/** Wizard step titles for Transporte Nuevo Registro (step 1 and 2). */
export const REGISTRO_CTTS_COMBUSTIBLE_TRANSPORTE_NUEVO_REGISTRO_WIZARD_STEPS =
  cfg.registroCttosCombustibleTransporteNuevoRegistroWizardSteps;

/** Wizard step titles for Suministro Nuevo Registro (step 1 and 2). */
export const REGISTRO_CTTS_COMBUSTIBLE_SUMINISTRO_NUEVO_REGISTRO_WIZARD_STEPS =
  cfg.registroCttosCombustibleSuministroNuevoRegistroWizardSteps;

/** Expected dropdown options per Transporte wizard combobox (tenant config). */
export const REGISTRO_CTTS_COMBUSTIBLE_TRANSPORTE_NUEVO_REGISTRO_FIELDS_DROPDOWN_OPTIONS: CombustibleWizardDropdownOptionsMap =
  cfg.registroCttosCombustibleTransporteNuevoRegistroFieldsDropdownOptions;

/** Expected dropdown options per Suministro wizard combobox (tenant config). */
export const REGISTRO_CTTS_COMBUSTIBLE_SUMINISTRO_NUEVO_REGISTRO_FIELDS_DROPDOWN_OPTIONS: CombustibleWizardDropdownOptionsMap =
  cfg.registroCttosCombustibleSuministroNuevoRegistroFieldsDropdownOptions;

/** Step-1 form fields for Transporte Nuevo Registro (tenant config). */
export const REGISTRO_CTTS_COMBUSTIBLE_TRANSPORTE_NUEVO_REGISTRO_FIELDS: readonly CombustibleWizardFieldDefinition[] =
  cfg.registroCttosCombustibleTransporteNuevoRegistroFields;

/** Transporte form labels in GECG QA not modeled as wizard field kinds. */
export const REGISTRO_CTTS_COMBUSTIBLE_TRANSPORTE_NUEVO_REGISTRO_EXTRA_LABELS = [
  'Incluye Transporte',
] as const;

/** Step-1 form fields for Suministro Nuevo Registro (tenant config). */
export const REGISTRO_CTTS_COMBUSTIBLE_SUMINISTRO_NUEVO_REGISTRO_FIELDS: readonly CombustibleWizardFieldDefinition[] =
  cfg.registroCttosCombustibleSuministroNuevoRegistroFields;

/**
 * Navigation and assertions for the Contratos combustible submodule under Registro.
 */
export class RegistroCttosCombustibleNavigationPage extends RegistroNavigationBasePage {
  /** URL slug segment per Contratos combustible tab (tenant config). */
  static readonly REGISTRO_CTTS_COMBUSTIBLE_TAB_SLUGS: Record<string, RegExp> = toTabSlugRecord(
    cfg.registroCttosCombustibleTabSlugs,
  );

  /** Breadcrumb third-segment text per active tab. */
  static readonly REGISTRO_CTTS_COMBUSTIBLE_TAB_BREADCRUMBS: Record<string, string> =
    cfg.registroCttosCombustibleTabBreadcrumbs;

  /**
   * Expands Registro and the Cttos combustible submodule dropdown in the sidebar.
   */
  async expandCttosCombustibleSidebar(): Promise<void> {
    await this.expandRegistroSubmodule('Cttos combustible');
  }

  /**
   * Asserts enabled sidebar menuitems and locked rows under Cttos combustible.
   */
  async expectCttosCombustibleSidebarLinksVisible(): Promise<void> {
    for (const tabName of REGISTRO_CTTS_COMBUSTIBLE_ENABLED_TAB_NAMES) {
      await expect(
        this.registroSubmenu().getByRole('menuitem', { name: tabName }).first(),
      ).toBeVisible();
    }
    for (const tabName of REGISTRO_CTTS_COMBUSTIBLE_LOCKED_TAB_NAMES) {
      await expect(
        this.registroSubmenu().getByRole('menuitem', { name: tabName, disabled: true }),
      ).toBeVisible();
    }
  }

  /**
   * Re-expands Registro and Cttos combustible when navigation collapsed the sidebar flyouts.
   */
  async ensureCttosCombustibleSidebarExpanded(): Promise<void> {
    await this.ensureRegistroSubmoduleNestedLinksVisible(
      'Cttos combustible',
      REGISTRO_CTTS_COMBUSTIBLE_DEFAULT_TAB,
    );
  }

  /**
   * Clicks a Contratos combustible sidebar row. Tabs without a nested link (Inventarios)
   * land on Transporte and then switch from the tab strip.
   */
  async clickCttosCombustibleSidebarLink(tabName: RegistroCttosCombustibleTabName): Promise<void> {
    await this.ensureCttosCombustibleSidebarExpanded();
    const link = this.registroSubmenu().getByRole('link', { name: tabName });
    if (await link.isVisible()) {
      await this.clickRegistroSubmenuLink(tabName);
      await expect(this.page).toHaveURL(
        RegistroCttosCombustibleNavigationPage.REGISTRO_CTTS_COMBUSTIBLE_TAB_SLUGS[tabName],
        { timeout: 15_000 },
      );
      return;
    }

    await this.clickRegistroSubmenuLink(REGISTRO_CTTS_COMBUSTIBLE_DEFAULT_TAB);
    await expect(this.page).toHaveURL(
      RegistroCttosCombustibleNavigationPage.REGISTRO_CTTS_COMBUSTIBLE_TAB_SLUGS[
        REGISTRO_CTTS_COMBUSTIBLE_DEFAULT_TAB
      ],
      { timeout: 15_000 },
    );
    if (tabName !== REGISTRO_CTTS_COMBUSTIBLE_DEFAULT_TAB) {
      await this.openContratosCombustibleTab(tabName);
    }
  }

  /**
   * Opens a Contratos combustible tab via sidebar nested links under Cttos combustible.
   */
  async openCttosCombustibleFromSidebar(tabName: RegistroCttosCombustibleTabName): Promise<void> {
    await this.expandCttosCombustibleSidebar();
    await this.clickCttosCombustibleSidebarLink(tabName);
  }

  /**
   * Opens Cttos combustible from the dashboard grid (eye affordance under the Registro card).
   */
  async openCttosCombustibleFromDashboardGrid(): Promise<void> {
    await this.registroDashboardCard()
      .getByRole('listitem')
      .filter({ hasText: 'Cttos combustible' })
      .getByLabel('eye')
      .click();
  }

  /**
   * Asserts locked Contratos combustible tabs (Insumos) are visible but disabled.
   */
  async expectLockedTabsDisabled(): Promise<void> {
    for (const tabName of REGISTRO_CTTS_COMBUSTIBLE_LOCKED_TAB_NAMES) {
      const tab = this.page.getByRole('tab', { name: tabName });
      await expect(tab).toBeVisible();
      await expect(tab).toBeDisabled();
    }
  }

  /**
   * Asserts a forced click on a locked tab does not navigate away from the current view.
   *
   * @param tabName - Locked tab label (e.g. Insumos).
   */
  async expectLockedTabDoesNotNavigate(tabName: RegistroCttosCombustibleTabName): Promise<void> {
    const url = this.page.url();
    const selected = this.page.getByRole('tab', { selected: true });
    const selectedName = (await selected.textContent())?.trim() ?? '';
    await this.page.getByRole('tab', { name: tabName }).click({ force: true });
    await expect(this.page).toHaveURL(url);
    if (selectedName) {
      await expect(this.page.getByRole('tab', { name: selectedName })).toHaveAttribute(
        'aria-selected',
        'true',
      );
    }
    await expect(this.page.getByRole('dialog')).toHaveCount(0);
  }

  /**
   * Asserts Contratos combustible gestor shell: URL, breadcrumb, and tab strip state.
   */
  async expectGestorDeDatosCttosCombustibleShell(): Promise<void> {
    await expect(this.page).toHaveURL(/gestor-de-datos\/contratos-combustible\//);
    const breadcrumb = this.page.getByRole('navigation');
    await expect(breadcrumb).toContainText('Gestor de datos');
    await expect(breadcrumb).toContainText('Contratos combustible');
    for (const tabName of REGISTRO_CTTS_COMBUSTIBLE_ENABLED_TAB_NAMES) {
      await expect(this.page.getByRole('tab', { name: tabName })).toBeVisible();
      await expect(this.page.getByRole('tab', { name: tabName })).toBeEnabled();
    }
    await this.expectLockedTabsDisabled();
  }

  /**
   * Opens a Contratos combustible tab and asserts selection, breadcrumb, and URL slug.
   */
  async openContratosCombustibleTab(tabName: RegistroCttosCombustibleTabName): Promise<void> {
    await this.page.getByRole('tab', { name: tabName }).click();
    await this.expectContratosCombustibleTabActive(tabName);
  }

  /**
   * Asserts the tab is selected, breadcrumb shows the tab label, and URL matches the slug.
   */
  async expectContratosCombustibleTabActive(tabName: RegistroCttosCombustibleTabName): Promise<void> {
    await expect(this.page).toHaveURL(
      RegistroCttosCombustibleNavigationPage.REGISTRO_CTTS_COMBUSTIBLE_TAB_SLUGS[tabName],
      { timeout: 15_000 },
    );
    const tab = this.page.getByRole('tab', { name: tabName });
    await expect(tab).toBeVisible();
    await expect(tab).toHaveAttribute('aria-selected', 'true');
    await expect(this.page.getByRole('navigation')).toContainText(
      RegistroCttosCombustibleNavigationPage.REGISTRO_CTTS_COMBUSTIBLE_TAB_BREADCRUMBS[tabName],
    );
  }

  /**
   * Asserts Layout A Transporte toolbar: search, Filtros, Carga Ramales, and Nuevo Registro.
   */
  async expectLayoutATransporteToolbar(): Promise<void> {
    const main = this.gestorMain();
    await expect(main.getByRole('searchbox', { name: /Buscar/i })).toBeVisible();
    await this.expectFiltrosControlVisible();
    await this.expectToolbarFilterChipsAbsent();
    await expect(main.getByRole('button', { name: 'Carga Ramales' })).toBeVisible();
    await expect(main.getByRole('button', { name: 'Nuevo Registro' })).toBeVisible();
  }

  /**
   * Asserts Layout B Suministro toolbar: search, Filtros, and Nuevo Registro (no Carga Ramales).
   */
  async expectLayoutBSuministroToolbar(): Promise<void> {
    const main = this.gestorMain();
    await expect(main.getByRole('searchbox', { name: /Buscar/i })).toBeVisible();
    await this.expectFiltrosControlVisible();
    await this.expectToolbarFilterChipsAbsent();
    await expect(main.getByRole('button', { name: 'Carga Ramales' })).toHaveCount(0);
    await expect(main.getByRole('button', { name: 'Nuevo Registro' })).toBeVisible();
  }

  /**
   * Asserts Inventarios currently lands on the Gestor 404 empty state (QA v2.7.0),
   * then returns to Transporte so the shared session is not left on the broken route.
   */
  async expectInventariosUnavailablePage(): Promise<void> {
    await expect(this.page.getByText('404')).toBeVisible();
    await expect(
      this.page.getByText(/la página que estás buscando no se encuentra disponible/i),
    ).toBeVisible();
    await expect(this.gestorMain().getByRole('table')).toHaveCount(0);
    await this.restoreDefaultCombustibleView();
  }

  /**
   * Leaves the Inventarios 404 route by selecting Transporte when that tab is available.
   */
  async restoreDefaultCombustibleView(): Promise<void> {
    const defaultTab = this.page.getByRole('tab', { name: REGISTRO_CTTS_COMBUSTIBLE_DEFAULT_TAB });
    if (!(await defaultTab.isVisible())) {
      return;
    }
    await defaultTab.click();
    await this.expectContratosCombustibleTabActive(REGISTRO_CTTS_COMBUSTIBLE_DEFAULT_TAB);
  }

  /**
   * Asserts Transporte grid column headers including Select all and Acciones.
   */
  async expectTransporteGridColumnHeaders(
    columnNames: readonly string[] = REGISTRO_CTTS_COMBUSTIBLE_TRANSPORTE_COLUMNS,
  ): Promise<void> {
    const table = this.gestorMain().getByRole('table').first();
    await assertTableColumnHeadersMatchConfig(table, columnNames, {
      additionalAllowedColumns: ['Select all', 'Acciones'],
    });
    await expect(table.getByRole('columnheader', { name: 'Select all' })).toBeVisible();
    await expect(table.getByRole('columnheader', { name: 'Acciones' })).toBeVisible();
  }

  /**
   * Asserts Suministro grid column headers without Select all; Acciones included.
   */
  async expectSuministroGridColumnHeaders(
    columnNames: readonly string[] = REGISTRO_CTTS_COMBUSTIBLE_SUMINISTRO_COLUMNS,
  ): Promise<void> {
    const table = this.gestorMain().getByRole('table').first();
    await assertTableColumnHeadersMatchConfig(table, columnNames, {
      additionalAllowedColumns: ['Acciones'],
    });
    await expect(table.getByRole('columnheader', { name: 'Select all' })).toHaveCount(0);
    await expect(table.getByRole('columnheader', { name: 'Acciones' })).toBeVisible();
  }

  /**
   * Asserts the Select all column header is visible (Layout A Transporte grid).
   */
  async expectSelectAllColumnVisible(): Promise<void> {
    await expect(
      this.gestorMain().getByRole('columnheader', { name: 'Select all' }),
    ).toBeVisible();
  }

  /**
   * Asserts the bulk-select column header is absent (Layout B Suministro grid).
   */
  async expectNoSelectAllColumn(): Promise<void> {
    const table = this.gestorMain().getByRole('table').first();
    await expect(table.getByRole('columnheader', { name: 'Select all' })).toHaveCount(0);
  }

  /**
   * Opens Carga Ramales, validates the Registrar Información dropzone, then closes the dialog.
   */
  async expectCargaRamalesDialogOpensAndCloses(): Promise<void> {
    await this.expectFileUploadDialogOpensAndCloses('Carga Ramales');
  }

  /**
   * Opens Transporte Nuevo Registro, validates step-1 fields and dropdowns, then closes the wizard.
   */
  async expectTransporteNuevoRegistroDialogOpensAndCloses(): Promise<void> {
    await this.expectCombustibleNuevoRegistroDialogOpensAndCloses({
      stepTitle: /Nuevo contrato Transporte/i,
      wizardSteps: REGISTRO_CTTS_COMBUSTIBLE_TRANSPORTE_NUEVO_REGISTRO_WIZARD_STEPS,
      fields: REGISTRO_CTTS_COMBUSTIBLE_TRANSPORTE_NUEVO_REGISTRO_FIELDS,
      dropdownOptions: REGISTRO_CTTS_COMBUSTIBLE_TRANSPORTE_NUEVO_REGISTRO_FIELDS_DROPDOWN_OPTIONS,
      extraExpectedLabels: REGISTRO_CTTS_COMBUSTIBLE_TRANSPORTE_NUEVO_REGISTRO_EXTRA_LABELS,
    });
  }

  /**
   * Opens Suministro Nuevo Registro, validates step-1 fields (including scrollable rows), then closes.
   */
  async expectSuministroNuevoRegistroDialogOpensAndCloses(): Promise<void> {
    await this.expectCombustibleNuevoRegistroDialogOpensAndCloses({
      stepTitle: /Nuevo contrato Suministro/i,
      wizardSteps: REGISTRO_CTTS_COMBUSTIBLE_SUMINISTRO_NUEVO_REGISTRO_WIZARD_STEPS,
      fields: REGISTRO_CTTS_COMBUSTIBLE_SUMINISTRO_NUEVO_REGISTRO_FIELDS,
      dropdownOptions: REGISTRO_CTTS_COMBUSTIBLE_SUMINISTRO_NUEVO_REGISTRO_FIELDS_DROPDOWN_OPTIONS,
      assertScrollableForm: true,
    });
  }

  /**
   * Asserts Transporte/Suministro Nuevo Registro wizard shell, fields, and footer, then closes.
   */
  private async expectCombustibleNuevoRegistroDialogOpensAndCloses(options: {
    stepTitle: string | RegExp;
    wizardSteps: readonly string[];
    fields: readonly CombustibleWizardFieldDefinition[];
    dropdownOptions: CombustibleWizardDropdownOptionsMap;
    assertScrollableForm?: boolean;
    extraExpectedLabels?: readonly string[];
  }): Promise<void> {
    await this.expectRegistroWizardDialogOpensAndCloses({
      ctaName: 'Nuevo Registro',
      fieldAssertOptions: {
        ...REGISTRO_WIZARD_FIELD_ASSERT_COMBUSTIBLE,
        retryOpen: true,
        allowExtraDropdownOptions: true,
      },
      ...options,
    });
  }
}
