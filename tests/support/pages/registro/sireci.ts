import { expect, type Locator } from '@playwright/test';
import { getRegistroSireciConfig, getModuleEnabledTabNames, isModuleEnabled, toTabSlugRecord } from '../../config/load-tenant-config';
import { MODULE_IDS } from '../../config/module-registry';
import type { RegistroSireciTabName } from '../../config/types/registro-sireci';
import {
  REGISTRO_WIZARD_FIELD_ASSERT_COMBUSTIBLE,
  RegistroNavigationBasePage,
  type RegistroWizardDropdownOptionsMap,
  type RegistroWizardFieldDefinition,
} from './registro-navigation-base';
import { assertRegistroWizardFieldsMatchConfig } from '../../registro/form-field-labels';
import { assertTabStripMatchesConfig } from '../../registro/tab-strip';
import { assertSidebarLabelsMatchConfig } from '../../registro/sidebar-labels';
import { assertTableColumnHeadersMatchConfig } from '../../registro/table-column-headers';

export type { RegistroSireciTabName };

const cfg = getRegistroSireciConfig();

/** Whether the Registro Sireci module is enabled for the active tenant. */
export const REGISTRO_SIRECI_ENABLED = isModuleEnabled(MODULE_IDS.registroSireci);

/** Tab labels on the Sireci module (tenant config). */
export const REGISTRO_SIRECI_TAB_NAMES = cfg.registroSireciTabNames;

/** Tabs reachable with current tenant credentials. */
export const REGISTRO_SIRECI_ENABLED_TAB_NAMES = getModuleEnabledTabNames(MODULE_IDS.registroSireci);

export const REGISTRO_SIRECI_LOCKED_TAB_NAMES = cfg.registroSireciLockedTabNames;

/** Resumen grid column headers (tenant config). */
export const REGISTRO_SIRECI_RESUMEN_COLUMNS = cfg.registroSireciResumenColumns;

/** Reporte grid column headers (tenant config). */
export const REGISTRO_SIRECI_REPORTE_COLUMNS = cfg.registroSireciReporteColumns;

/** Nuevo Registro flat-form combobox fields (tenant config). */
export const REGISTRO_SIRECI_NUEVO_REGISTRO_COMBOBOX_FIELDS: readonly RegistroWizardFieldDefinition[] =
  cfg.registroSireciNuevoRegistroComboboxFields;

/** Nuevo Registro flat-form text and date fields (tenant config). */
export const REGISTRO_SIRECI_NUEVO_REGISTRO_TEXT_DATE_FIELDS: readonly RegistroWizardFieldDefinition[] =
  cfg.registroSireciNuevoRegistroTextDateFields;

/** Spinbutton labels on Nuevo Registro (tenant config). */
export const REGISTRO_SIRECI_NUEVO_REGISTRO_SPINBUTTON_LABELS =
  cfg.registroSireciNuevoRegistroSpinbuttonLabels;

/** Expected dropdown options per Nuevo Registro combobox (tenant config). */
export const REGISTRO_SIRECI_NUEVO_REGISTRO_FIELDS_DROPDOWN_OPTIONS: RegistroWizardDropdownOptionsMap =
  cfg.registroSireciNuevoRegistroFieldsDropdownOptions;

/**
 * Navigation and assertions for the Sireci submodule under Registro.
 */
export class RegistroSireciNavigationPage extends RegistroNavigationBasePage {
  /** URL slug segment per Sireci tab (tenant config). */
  static readonly REGISTRO_SIRECI_TAB_SLUGS: Record<string, RegExp> = toTabSlugRecord(
    cfg.registroSireciTabSlugs,
  );

  /** Breadcrumb third-segment text per active tab (tenant config). */
  static readonly REGISTRO_SIRECI_TAB_BREADCRUMBS: Record<string, string> =
    cfg.registroSireciTabBreadcrumbs;

  /** Sidebar nested link href per tab (tenant config). */
  static readonly REGISTRO_SIRECI_SIDEBAR_HREFS: Record<string, string> =
    cfg.registroSireciSidebarHrefs;

  /**
   * Expands Registro and the Sireci submodule dropdown in the sidebar.
   */
  async expandSireciSidebar(): Promise<void> {
    await this.expandRegistroSubmodule('Sireci');
  }

  /**
   * Ensures Sireci is expanded and nested Resumen / Reporte sidebar links are visible.
   */
  async ensureSireciSidebarExpanded(): Promise<void> {
    await this.expandRegistroSidebar();
    const row = this.registroSubmenu().getByRole('menuitem', { name: 'Sireci' }).first();
    const resumenLink = this.registroSubmenu().getByRole('link', { name: 'Resumen' });
    await expect(async () => {
      if ((await row.getAttribute('aria-expanded')) !== 'true') {
        await row.click();
      }
      await expect(resumenLink).toBeVisible();
    }).toPass({ timeout: 10_000 });
  }

  /**
   * Asserts Sireci appears in the expanded Registro sidebar submenu.
   */
  async expectSireciSubmenuEntryVisible(): Promise<void> {
    await this.expandRegistroSidebar();
    await expect(this.registroSubmenu().getByRole('menuitem', { name: 'Sireci' }).first()).toBeVisible();
  }

  /**
   * Asserts Sireci is expanded and nested sidebar links match tenant config exactly.
   */
  async expectSireciNestedSidebarLinksVisible(): Promise<void> {
    await this.ensureSireciSidebarExpanded();
    const row = this.registroSubmenu().getByRole('menuitem', { name: 'Sireci' }).first();
    await expect(row).toHaveAttribute('aria-expanded', 'true');
    await assertSidebarLabelsMatchConfig(
      this.registroSubmoduleNestedItems(),
      REGISTRO_SIRECI_TAB_NAMES,
      { context: 'Sireci nested sidebar' },
    );
    for (const tabName of REGISTRO_SIRECI_TAB_NAMES) {
      const link = this.registroSubmenu().getByRole('link', { name: tabName, exact: true });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute(
        'href',
        RegistroSireciNavigationPage.REGISTRO_SIRECI_SIDEBAR_HREFS[tabName],
      );
    }
  }

  /**
   * Opens a Sireci tab via sidebar nested links under Sireci.
   */
  async openSireciFromSidebar(tabName: RegistroSireciTabName): Promise<void> {
    await this.ensureSireciSidebarExpanded();
    const link = this.registroSubmenu().getByRole('link', { name: tabName }).first();
    await expect(link).toBeVisible();
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await expect(this.page).toHaveURL(RegistroSireciNavigationPage.REGISTRO_SIRECI_TAB_SLUGS[tabName], {
      timeout: 15_000,
    });
  }

  /**
   * Opens Sireci from the dashboard grid (eye affordance under the Registro card).
   */
  async openSireciFromDashboardGrid(): Promise<void> {
    await expect(async () => {
      await this.hoverRegistroDashboardCard();
      const eye = this.registroDashboardCard()
        .getByRole('listitem')
        .filter({ hasText: 'Sireci' })
        .getByLabel('eye');
      await expect(eye).toBeVisible();
      await eye.click();
    }).toPass({ timeout: 15_000 });
  }

  /**
   * Asserts the Registro dashboard hover menu exposes Sireci with an eye affordance.
   */
  async expectSireciVisibleOnDashboardHover(): Promise<void> {
    await expect(async () => {
      await this.hoverRegistroDashboardCard();
      const card = this.registroDashboardCard();
      for (const label of ['Planta y consumos', 'Otros documentos', 'RPM', 'SIRECI', 'Historial']) {
        await expect(card.getByText(label, { exact: true })).toBeVisible();
      }
      await expect(
        card.getByRole('listitem').filter({ hasText: 'Sireci' }).getByLabel('eye'),
      ).toBeVisible();
    }).toPass({ timeout: 15_000 });
  }

  /**
   * Asserts Sireci gestor shell: URL, breadcrumb, tab strip, search, and data grid.
   */
  async expectGestorDeDatosSireciShell(): Promise<void> {
    await expect(this.page).toHaveURL(/gestor-de-datos\/sireci\//);
    const breadcrumb = this.page.getByRole('navigation');
    await expect(breadcrumb).toContainText('Gestor de datos');
    await expect(breadcrumb).toContainText('Sireci');
    await assertTabStripMatchesConfig(this.page, {
      enabledTabs: REGISTRO_SIRECI_ENABLED_TAB_NAMES,
      lockedTabs: REGISTRO_SIRECI_LOCKED_TAB_NAMES,
      context: 'Sireci',
    });
    await expect(this.gestorMain().getByRole('searchbox', { name: /Buscar/i })).toBeVisible();
    await expect(this.gestorMain().getByRole('table').first()).toBeVisible();
  }

  /**
   * Asserts the tab is selected, breadcrumb shows the tab label, and URL matches the slug.
   */
  async expectSireciViewActive(tabName: RegistroSireciTabName): Promise<void> {
    await expect(this.page).toHaveURL(RegistroSireciNavigationPage.REGISTRO_SIRECI_TAB_SLUGS[tabName], {
      timeout: 15_000,
    });
    const tab = this.page.getByRole('tab', { name: tabName, exact: true });
    await expect(tab).toBeVisible();
    await expect(tab).toHaveAttribute('aria-selected', 'true');
    await expect(this.page.getByRole('navigation')).toContainText(
      RegistroSireciNavigationPage.REGISTRO_SIRECI_TAB_BREADCRUMBS[tabName],
    );
    await expect(this.gestorMain().getByRole('table').first()).toBeVisible();
  }

  /**
   * Opens an in-module tab and asserts URL, breadcrumb, and aria-selected state.
   */
  async openSireciTab(tabName: RegistroSireciTabName): Promise<void> {
    await this.page.getByRole('tab', { name: tabName, exact: true }).click();
    await this.expectSireciViewActive(tabName);
  }

  /**
   * Asserts the tab strip matches tenant config and the partner tab is visible but not selected.
   *
   * @param activeTab - Currently selected Sireci tab whose mate must stay unselected.
   */
  async expectSireciPairTabVisible(activeTab: RegistroSireciTabName): Promise<void> {
    await assertTabStripMatchesConfig(this.page, {
      enabledTabs: REGISTRO_SIRECI_ENABLED_TAB_NAMES,
      lockedTabs: REGISTRO_SIRECI_LOCKED_TAB_NAMES,
      context: 'Sireci',
    });
    const enabledTabs = REGISTRO_SIRECI_ENABLED_TAB_NAMES.filter((tab) => tab !== activeTab);
    if (enabledTabs.length === 0) {
      return;
    }
    const mate = enabledTabs[0];
    const mateTab = this.page.getByRole('tab', { name: mate, exact: true });
    await expect(mateTab).toBeVisible();
    await expect(mateTab).toHaveAttribute('aria-selected', 'false');
  }

  /**
   * Asserts data-table column headers in the first main grid match tenant config exactly.
   *
   * @param columnNames - Expected column header labels.
   */
  async expectGridColumnHeaders(columnNames: readonly string[]): Promise<void> {
    const table = this.gestorMain().getByRole('table').first();
    await assertTableColumnHeadersMatchConfig(table, columnNames, { context: 'Sireci' });
  }

  /**
   * Asserts pagination footer with item count and page-size selector.
   */
  async expectGridPaginationFooter(pageSizeLabel: string): Promise<void> {
    const main = this.gestorMain();
    await expect(main.getByText(/Total \d+ items?/)).toBeVisible();
    await expect(main.getByText(pageSizeLabel)).toBeVisible();
  }

  /**
   * Asserts the grid shows at least one data row or an explicit empty-state heading.
   */
  async expectGridHasDataOrEmptyState(): Promise<void> {
    const main = this.gestorMain();
    const table = main.getByRole('table').first();
    await expect(table).toBeVisible();
    const empty = main.getByRole('heading', { name: 'No se encontraron datos' });
    if (await empty.isVisible()) {
      await expect(empty).toBeVisible();
      return;
    }
    await expect(main.locator('table tbody tr td').first()).toBeVisible();
  }

  /**
   * Asserts Resumen toolbar: search, filter chips, CTAs, and no Filtros chip.
   */
  async expectSireciResumenToolbar(): Promise<void> {
    const main = this.gestorMain();
    await expect(main.getByRole('searchbox', { name: /Buscar/i })).toBeVisible();
    await expect(main.getByRole('button', { name: 'search' })).toBeVisible();
    await expect(main.getByText('Filtros', { exact: true })).toHaveCount(0);
    await expect(this.filterChip('Modo Yo')).toBeVisible();
    await expect(this.filterChip('Estado')).toBeVisible();
    await expect(this.filterChip('Usuarios')).toBeVisible();
    await expect(main.getByRole('button', { name: 'Descargar Reporte' })).toBeVisible();
    await expect(main.getByRole('button', { name: 'Nuevo Registro' })).toBeVisible();
    await this.expectGridPaginationFooter('15 / página');
  }

  /**
   * Asserts Reporte toolbar: search, Filtros chip, filter chips, and Descargar Reporte only.
   */
  async expectSireciReporteToolbar(): Promise<void> {
    const main = this.gestorMain();
    await expect(main.getByRole('searchbox', { name: /Buscar/i })).toBeVisible();
    await expect(main.getByRole('button', { name: 'search' })).toBeVisible();
    await expect(main.getByText('Filtros', { exact: true })).toBeVisible();
    await expect(this.filterChip('Modo Yo')).toBeVisible();
    await expect(this.filterChip('Estado')).toBeVisible();
    await expect(this.filterChip('Usuarios')).toBeVisible();
    await expect(main.getByRole('button', { name: 'Descargar Reporte' })).toBeVisible();
    await expect(main.getByRole('button', { name: 'Nuevo Registro' })).toHaveCount(0);
    await this.expectGridPaginationFooter('10 / página');
  }

  /**
   * Toggles Modo Yo on then off and asserts the view URL is restored.
   * Actively dismisses any filter-triggered popup instead of waiting for auto-dismiss.
   */
  async expectModoYoFilterToggle(): Promise<void> {
    const chip = this.filterChip('Modo Yo');
    const url = this.page.url();
    await chip.click();
    await this.dismissFilterPopups();
    await chip.click();
    await expect(this.page).toHaveURL(url);
  }

  /**
   * Asserts Reporte grid column headers in the first main table.
   */
  async expectSireciReporteGridColumnHeaders(
    columnNames: readonly string[] = REGISTRO_SIRECI_REPORTE_COLUMNS,
  ): Promise<void> {
    await this.expectGridColumnHeaders(columnNames);
  }

  /**
   * Clicks the Reporte Filtros chip and returns the opened dialog locator.
   */
  protected filtrosChip(): Locator {
    return this.gestorMain()
      .locator('div')
      .filter({ hasText: /^Filtros$/ })
      .first();
  }

  /**
   * Opens the Filtros modal, asserts structure, then dismisses with Close.
   */
  async expectFiltrosModalOpensAndCloses(): Promise<void> {
    await this.expectNoVisibleModals();
    await this.filtrosChip().click();
    const dialog = this.page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 15_000 });
    await expect(dialog).toContainText('Filtros');
    await expect(dialog.getByRole('button', { name: /Añadir filtro/i })).toBeVisible();
    await expect(dialog.getByRole('button', { name: /Limpiar todo/i })).toBeVisible();
    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).not.toBeVisible({ timeout: 10_000 });
    await this.expectNoVisibleModals();
  }

  /**
   * Opens Descargar Reporte confirmation dialog, asserts content, dismisses with Cancelar.
   */
  async expectDescargarReporteDialogOpensAndCloses(): Promise<void> {
    await this.expectNoVisibleModals();
    await this.gestorMain().getByRole('button', { name: 'Descargar Reporte' }).click();
    const dialog = this.page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 15_000 });
    await expect(dialog).toContainText('Confirmar acción');
    await expect(dialog).toContainText(/reporte del SIRECI/i);
    await expect(dialog.getByRole('button', { name: 'Cancelar' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Aceptar' })).toBeVisible();
    await dialog.getByRole('button', { name: 'Cancelar' }).click();
    await expect(dialog).not.toBeVisible({ timeout: 10_000 });
    await this.expectNoVisibleModals();
    await expect(this.gestorMain().getByRole('table').first()).toBeVisible();
  }

  /**
   * Opens Estado filter dialog, asserts combobox placeholder, then dismisses with Close.
   */
  async expectEstadoFilterDialogWithCombobox(): Promise<void> {
    await this.dismissNotificationToasts();
    await this.filterChip('Estado').click();
    const dialog = this.page.getByRole('dialog');
    await expect(dialog).toContainText('Filtrar por Estado de simulación');
    await expect(dialog.getByText('Seleccione una opción')).toBeVisible();
    await this.dismissNotificationToasts();
    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).not.toBeVisible();
  }

  /**
   * Opens Usuarios filter dialog, asserts combobox placeholder, then dismisses with Close.
   */
  async expectUsuariosFilterDialogWithCombobox(): Promise<void> {
    await this.dismissNotificationToasts();
    await this.filterChip('Usuarios').click();
    const dialog = this.page.getByRole('dialog');
    await expect(dialog).toContainText('Filtrar por usuarios');
    await expect(dialog.getByText('Seleccione una opción')).toBeVisible();
    await this.dismissNotificationToasts();
    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).not.toBeVisible();
  }

  /**
   * Asserts Nuevo Registro spinbutton fields are present in the flat form.
   */
  async expectNuevoRegistroSpinbuttonsPresent(dialog: Locator): Promise<void> {
    for (const label of REGISTRO_SIRECI_NUEVO_REGISTRO_SPINBUTTON_LABELS) {
      const name = label === 'Ctto valor inicial' ? `* ${label}` : label;
      const spinbutton = dialog.getByRole('spinbutton', { name });
      await spinbutton.scrollIntoViewIfNeeded();
      await expect(spinbutton).toBeVisible();
    }
  }

  /**
   * Opens Nuevo Registro, validates shell, fields, dropdowns, and spinbuttons, then closes.
   */
  async expectNuevoRegistroDialogOpensAndCloses(): Promise<void> {
    await this.expectNoVisibleModals();
    const dialog = await this.openRegistrarInformacionDialog('Nuevo Registro');
    await expect(dialog).toContainText('Registrar Información');
    await expect(dialog.getByRole('button', { name: 'Limpiar' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Guardar' })).toBeVisible();
    await expect(
      dialog.getByRole('combobox', { name: '* Contrato', exact: true }),
    ).toBeVisible();
    await expect(
      dialog.getByRole('combobox', { name: '* Tipo seguimiento', exact: true }),
    ).toBeVisible();
    await expect(
      dialog.getByRole('spinbutton', { name: '* Ctto valor inicial', exact: true }),
    ).toBeVisible();

    await this.expectWizardScrollableFieldsReachable(
      dialog,
      [
        ...REGISTRO_SIRECI_NUEVO_REGISTRO_COMBOBOX_FIELDS,
        ...REGISTRO_SIRECI_NUEVO_REGISTRO_TEXT_DATE_FIELDS,
      ],
      REGISTRO_WIZARD_FIELD_ASSERT_COMBUSTIBLE,
    );

    await assertRegistroWizardFieldsMatchConfig(
      dialog,
      [
        ...REGISTRO_SIRECI_NUEVO_REGISTRO_COMBOBOX_FIELDS,
        ...REGISTRO_SIRECI_NUEVO_REGISTRO_TEXT_DATE_FIELDS,
      ],
      { extraExpectedLabels: REGISTRO_SIRECI_NUEVO_REGISTRO_SPINBUTTON_LABELS },
    );

    for (const field of REGISTRO_SIRECI_NUEVO_REGISTRO_COMBOBOX_FIELDS) {
      await this.expectRegistroWizardField(
        dialog,
        field,
        REGISTRO_SIRECI_NUEVO_REGISTRO_FIELDS_DROPDOWN_OPTIONS,
        REGISTRO_WIZARD_FIELD_ASSERT_COMBUSTIBLE,
      );
    }

    for (const field of REGISTRO_SIRECI_NUEVO_REGISTRO_TEXT_DATE_FIELDS) {
      await this.expectRegistroWizardField(
        dialog,
        field,
        REGISTRO_SIRECI_NUEVO_REGISTRO_FIELDS_DROPDOWN_OPTIONS,
        REGISTRO_WIZARD_FIELD_ASSERT_COMBUSTIBLE,
      );
    }

    await this.expectNuevoRegistroSpinbuttonsPresent(dialog);

    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).not.toBeVisible({ timeout: 10_000 });
    await this.expectNoVisibleModals();
    await expect(this.gestorMain().getByRole('table').first()).toBeVisible();
  }
}
