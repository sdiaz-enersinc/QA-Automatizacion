import { expect } from '@playwright/test';
import { getRegistroOtrosDocumentosConfig, getModuleEnabledTabNames, isModuleEnabled, toTabSlugRecord } from '../../config/load-tenant-config';
import { MODULE_IDS } from '../../config/module-registry';
import type { RegistroOtrosDocumentosViewName } from '../../config/types/registro-otros-documentos';
import { RegistroNavigationBasePage } from './registro-navigation-base';
import { assertTableColumnHeadersMatchConfig } from '../../registro/table-column-headers';

export type { RegistroOtrosDocumentosViewName };

const cfg = getRegistroOtrosDocumentosConfig();

/** Whether the Registro Otros documentos module is enabled for the active tenant. */
export const REGISTRO_OTROS_DOCUMENTOS_ENABLED = isModuleEnabled(MODULE_IDS.registroOtrosDocumentos);

/** All Otros documentos sidebar/tab views (tenant config). */
export const REGISTRO_OTROS_DOCUMENTOS_VIEW_NAMES = cfg.registroOtrosDocumentosViewNames;

/** Views reachable with current tenant credentials. */
export const REGISTRO_OTROS_DOCUMENTOS_ENABLED_VIEW_NAMES = getModuleEnabledTabNames(
  MODULE_IDS.registroOtrosDocumentos,
);

/** Hidrologia views under Otros documentos (tenant config). */
export const REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_VIEWS = cfg.registroOtrosDocumentosHidrologiaViews;

/** Contadores views under Otros documentos (tenant config). */
export const REGISTRO_OTROS_DOCUMENTOS_CONTADORES_VIEWS = cfg.registroOtrosDocumentosContadoresViews;

/** Hidrologia Horaria grid column headers (tenant config). */
export const REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_HORARIA_COLUMNS =
  cfg.registroOtrosDocumentosHidrologiaHorariaColumns;

/** Hidrologia Diaria grid column headers (tenant config). */
export const REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_DIARIA_COLUMNS =
  cfg.registroOtrosDocumentosHidrologiaDiariaColumns;

/** Contadores Frt / INTI grid column headers (tenant config). */
export const REGISTRO_OTROS_DOCUMENTOS_CONTADORES_COLUMNS =
  cfg.registroOtrosDocumentosContadoresColumns;

type OtrosDocumentosNestedGroup = 'Hidrologia' | 'Contadores';

/**
 * Navigation and assertions for the Otros documentos submodule under Registro.
 */
export class RegistroOtrosDocumentosNavigationPage extends RegistroNavigationBasePage {
  /** URL slug segment per Otros documentos view (tenant config). */
  static readonly REGISTRO_OTROS_DOCUMENTOS_VIEW_SLUGS: Record<string, RegExp> = toTabSlugRecord(
    cfg.registroOtrosDocumentosViewSlugs,
  );

  /** Breadcrumb third-segment text per active view (tenant config). */
  static readonly REGISTRO_OTROS_DOCUMENTOS_VIEW_BREADCRUMBS: Record<string, string> =
    cfg.registroOtrosDocumentosViewBreadcrumbs;

  /** Sidebar nested flyout group per view (tenant config). */
  static readonly REGISTRO_OTROS_DOCUMENTOS_NESTED_GROUP: Record<string, OtrosDocumentosNestedGroup> =
    cfg.registroOtrosDocumentosNestedGroup as Record<string, OtrosDocumentosNestedGroup>;

  /** Cross-navigation tab partner within each pair (tenant config). */
  static readonly REGISTRO_OTROS_DOCUMENTOS_TAB_PAIR_MATE: Record<string, string> =
    cfg.registroOtrosDocumentosTabPairMate;

  /**
   * Expands Registro and the Otros documentos submodule dropdown in the sidebar.
   */
  async expandOtrosDocumentosSidebar(): Promise<void> {
    await this.expandRegistroSubmodule('Otros documentos');
  }

  /**
   * Expands a nested sidebar group (Hidrologia or Contadores) under Otros documentos.
   *
   * @param group - Nested flyout group under Otros documentos.
   */
  async expandOtrosDocumentosNestedGroup(group: OtrosDocumentosNestedGroup): Promise<void> {
    await this.expandOtrosDocumentosSidebar();
    const row = this.registroSubmenu().getByRole('menuitem', { name: group }).first();
    await expect(async () => {
      if ((await row.getAttribute('aria-expanded')) !== 'true') {
        await row.click();
      }
      await expect(row).toHaveAttribute('aria-expanded', 'true');
    }).toPass({ timeout: 10_000 });
  }

  /**
   * Asserts Otros documentos exposes Hidrologia and Contadores nested groups in the sidebar.
   */
  async expectOtrosDocumentosSubmenuGroupsVisible(): Promise<void> {
    await this.expandOtrosDocumentosSidebar();
    await expect(this.registroSubmenu().getByRole('menuitem', { name: 'Hidrologia' }).first()).toBeVisible();
    await expect(this.registroSubmenu().getByRole('menuitem', { name: 'Contadores' }).first()).toBeVisible();
  }

  /**
   * Opens an Otros documentos view via sidebar nested menuitems.
   *
   * @param viewName - Enabled view label.
   */
  async openOtrosDocumentosFromSidebar(viewName: RegistroOtrosDocumentosViewName): Promise<void> {
    const group =
      RegistroOtrosDocumentosNavigationPage.REGISTRO_OTROS_DOCUMENTOS_NESTED_GROUP[viewName];
    await this.expandOtrosDocumentosNestedGroup(group);
    const item = this.registroSubmenu().getByRole('menuitem', { name: viewName }).first();
    await expect(item).toBeVisible();
    await item.scrollIntoViewIfNeeded();
    await item.click();
    await expect(this.page).toHaveURL(
      RegistroOtrosDocumentosNavigationPage.REGISTRO_OTROS_DOCUMENTOS_VIEW_SLUGS[viewName],
      {
        timeout: 15_000,
      },
    );
  }

  /**
   * Opens an in-module tab and asserts URL, breadcrumb, and aria-selected state.
   *
   * @param viewName - Target tab label.
   */
  async openOtrosDocumentosTab(viewName: RegistroOtrosDocumentosViewName): Promise<void> {
    await this.page.getByRole('tab', { name: viewName }).click();
    await this.expectOtrosDocumentosViewActive(viewName);
  }

  /**
   * Asserts the view tab is selected, breadcrumb matches, URL slug matches, and main grid is visible.
   *
   * @param viewName - Expected active view label.
   */
  async expectOtrosDocumentosViewActive(viewName: RegistroOtrosDocumentosViewName): Promise<void> {
    await expect(this.page).toHaveURL(
      RegistroOtrosDocumentosNavigationPage.REGISTRO_OTROS_DOCUMENTOS_VIEW_SLUGS[viewName],
      {
        timeout: 15_000,
      },
    );
    const tab = this.page.getByRole('tab', { name: viewName });
    await expect(tab).toBeVisible();
    await expect(tab).toHaveAttribute('aria-selected', 'true');
    await expect(this.page.getByRole('navigation')).toContainText(
      RegistroOtrosDocumentosNavigationPage.REGISTRO_OTROS_DOCUMENTOS_VIEW_BREADCRUMBS[viewName],
    );
    await expect(this.gestorMain().getByRole('table').first()).toBeVisible();
  }

  /**
   * Asserts the cross-navigation partner tab is visible but not selected.
   *
   * @param viewName - Active view whose pair mate must be visible.
   */
  async expectOtrosDocumentosPairTabVisible(viewName: RegistroOtrosDocumentosViewName): Promise<void> {
    const mate = RegistroOtrosDocumentosNavigationPage.REGISTRO_OTROS_DOCUMENTOS_TAB_PAIR_MATE[viewName];
    const mateTab = this.page.getByRole('tab', { name: mate });
    await expect(mateTab).toBeVisible();
    await expect(mateTab).toHaveAttribute('aria-selected', 'false');
  }

  /**
   * Asserts Otros documentos toolbar: search, filter chips, Cargar archivo, and no Filtros chip.
   */
  async expectOtrosDocumentosToolbar(): Promise<void> {
    const main = this.gestorMain();
    await expect(main.getByRole('searchbox', { name: /Buscar/i })).toBeVisible();
    await this.expectFiltrosControlAbsent();
    await this.expectToolbarFilterChipsAbsent();
    await expect(main.getByRole('button', { name: 'Cargar archivo' })).toBeVisible();
  }

  /**
   * Opens an Otros documentos view by deep-linking the tenant slug (sidebar workaround).
   *
   * @param viewName - Enabled view label.
   */
  async openOtrosDocumentosByUrl(viewName: RegistroOtrosDocumentosViewName): Promise<void> {
    const slug = cfg.registroOtrosDocumentosViewSlugs[viewName];
    await this.page.goto(`/gestor-de-datos/${slug}`);
    await expect(this.page).toHaveURL(
      RegistroOtrosDocumentosNavigationPage.REGISTRO_OTROS_DOCUMENTOS_VIEW_SLUGS[viewName],
      { timeout: 15_000 },
    );
  }

  /**
   * Asserts Otros documentos gestor shell: URL, breadcrumb, and the active pair's tabs.
   */
  async expectGestorDeDatosOtrosDocumentosShell(): Promise<void> {
    await expect(this.page).toHaveURL(/gestor-de-datos\/otros-documentos\//);
    await expect(this.page.getByRole('navigation')).toContainText('Gestor de datos');
    for (const tabName of this.activeOtrosDocumentosPairViews()) {
      const tab = this.page.getByRole('tab', { name: tabName });
      await expect(tab).toBeVisible();
      await expect(tab).toBeEnabled();
    }
  }

  /**
   * Asserts data-table column headers in the first main grid.
   *
   * @param columnNames - Expected column header labels.
   */
  async expectGridColumnHeaders(columnNames: readonly string[]): Promise<void> {
    const table = this.gestorMain().getByRole('table').first();
    await assertTableColumnHeadersMatchConfig(table, columnNames);
  }

  /**
   * Asserts grid columns and view-specific extras for an Otros documentos layout.
   *
   * @param viewName - Active Hidrologia or Contadores view label.
   */
  async expectOtrosDocumentosLayout(viewName: RegistroOtrosDocumentosViewName): Promise<void> {
    await this.expectGridColumnHeaders(this.columnsForView(viewName));
    if (viewName === REGISTRO_OTROS_DOCUMENTOS_CONTADORES_VIEWS[0]) {
      await this.expectOtrosDocumentosPairTabVisible(viewName);
      await this.expectContadoresFrtSampleRows();
      return;
    }
    if (viewName === REGISTRO_OTROS_DOCUMENTOS_CONTADORES_VIEWS[1]) {
      await this.expectNoErrorBanner();
      return;
    }
    if (viewName === REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_VIEWS[0]) {
      await this.expectGridPaginationFooter();
      return;
    }
    if (viewName === REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_VIEWS[1]) {
      await this.expectGridHasDataOrEmptyState();
    }
  }

  /**
   * Asserts pagination footer with item count and default page size selector.
   */
  async expectGridPaginationFooter(): Promise<void> {
    const main = this.gestorMain();
    await expect(main.getByText(/Total \d+ items?/)).toBeVisible();
    await expect(main.getByText('15 / página')).toBeVisible();
  }

  /**
   * Asserts the grid shows at least one data row or an explicit empty-state heading.
   */
  async expectGridHasDataOrEmptyState(): Promise<void> {
    const main = this.gestorMain();
    await expect(main.getByRole('table').first()).toBeVisible();
    const empty = main.getByRole('heading', { name: 'No se encontraron datos' });
    const dataCell = main.locator('table tbody tr td').first();
    await expect(empty.or(dataCell)).toBeVisible();
  }

  /**
   * Asserts Contadores Frt sample rows include Frontera codes prefixed with Frt.
   */
  async expectContadoresFrtSampleRows(): Promise<void> {
    await expect(this.gestorMain().getByRole('table').first().getByText(/^Frt/)).toBeVisible();
  }

  /**
   * Asserts no application error banner is shown on the current view.
   */
  async expectNoErrorBanner(): Promise<void> {
    await expect(this.page.getByText('404')).toHaveCount(0);
    await expect(this.page.getByText(/Configuración no encontrada/i)).toHaveCount(0);
  }

  /**
   * Opens Cargar archivo upload dialog, validates dropzone and Guardar, then closes it.
   */
  async expectCargarArchivoDialogOpensAndCloses(): Promise<void> {
    await this.expectFileUploadDialogOpensAndCloses('Cargar archivo');
    await expect(this.gestorMain().getByRole('table').first()).toBeVisible();
  }

  /**
   * Hovers the Registro dashboard card and asserts Otros documentos appears with an eye icon.
   */
  async expectOtrosDocumentosVisibleOnDashboardHover(): Promise<void> {
    await this.hoverRegistroDashboardCard();
    const card = this.registroDashboardCard();
    for (const label of ['Insumos oferta', 'Otros documentos', 'RPM', 'SIRECI', 'Historial']) {
      await expect(card.getByText(label, { exact: true })).toBeVisible();
    }
    const otrosRow = card.getByRole('listitem').filter({ hasText: 'Otros documentos' });
    await expect(otrosRow.getByLabel('eye')).toBeVisible();
  }

  /**
   * Path B: asserts pinned Registro card rows, hovers to reveal Otros documentos, and clicks the eye.
   */
  async openOtrosDocumentosFromDashboardHover(): Promise<void> {
    const card = this.registroDashboardCard();
    await expect(card).toBeVisible();
    for (const label of ['Empresas', 'Cttos energía', 'Cttos combustible'] as const) {
      await expect(card.getByText(label)).toBeVisible();
      await expect(
        card.getByRole('listitem').filter({ hasText: label }).getByLabel('eye'),
      ).toBeVisible();
    }
    await this.expectOtrosDocumentosVisibleOnDashboardHover();
    await this.openOtrosDocumentosFromDashboardGrid();
  }

  /**
   * Clicks the Otros documentos eye icon on the Registro dashboard card.
   */
  async openOtrosDocumentosFromDashboardGrid(): Promise<void> {
    await this.hoverRegistroDashboardCard();
    await this.registroDashboardCard()
      .getByRole('listitem')
      .filter({ hasText: 'Otros documentos' })
      .getByLabel('eye')
      .click();
  }

  /**
   * Returns Hidrologia or Contadores views matching the current gestor URL.
   */
  private activeOtrosDocumentosPairViews(): readonly string[] {
    const url = this.page.url();
    const isHidrologia = REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_VIEWS.some((viewName) =>
      RegistroOtrosDocumentosNavigationPage.REGISTRO_OTROS_DOCUMENTOS_VIEW_SLUGS[viewName].test(url),
    );
    return isHidrologia
      ? REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_VIEWS
      : REGISTRO_OTROS_DOCUMENTOS_CONTADORES_VIEWS;
  }

  /**
   * Returns tenant-configured column headers for an Otros documentos view.
   *
   * @param viewName - Hidrologia or Contadores view label.
   */
  private columnsForView(viewName: RegistroOtrosDocumentosViewName): readonly string[] {
    const columnsByView: Record<string, readonly string[]> = {
      [REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_VIEWS[0]]:
        REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_HORARIA_COLUMNS,
      [REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_VIEWS[1]]:
        REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_DIARIA_COLUMNS,
    };
    for (const contadoresView of REGISTRO_OTROS_DOCUMENTOS_CONTADORES_VIEWS) {
      columnsByView[contadoresView] = REGISTRO_OTROS_DOCUMENTOS_CONTADORES_COLUMNS;
    }
    const columns = columnsByView[viewName];
    if (!columns) {
      throw new Error(`No column config for Otros documentos view: ${viewName}`);
    }
    return columns;
  }

  /**
   * Asserts dashboard hover entry lands on the broken Otros documentos root URL with a 404 banner.
   */
  async expectOtrosDocumentosDashboard404(): Promise<void> {
    await expect(this.page).toHaveURL(/gestor-de-datos\/otros-documentos\/?$/);
    await expect(this.page.getByText('404')).toBeVisible();
    await expect(this.page.getByText(/Configuración no encontrada/i)).toBeVisible();
    await expect(this.page.getByRole('tablist')).toHaveCount(0);
  }
}
