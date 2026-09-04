import { expect } from '@playwright/test';
import {
  getRegistroOtrosContratosConfig,
  getModuleEnabledTabNames,
  isModuleEnabled,
  toTabSlugRecord,
} from '../../config/load-tenant-config';
import { MODULE_IDS } from '../../config/module-registry';
import type { RegistroOtrosContratosTabName } from '../../config/types/registro-otros-contratos';
import {
  REGISTRO_WIZARD_FIELD_ASSERT_ENERGIA,
  RegistroNavigationBasePage,
} from './registro-navigation-base';
import { assertTableColumnHeadersMatchConfig } from '../../registro/table-column-headers';

const cfg = getRegistroOtrosContratosConfig();

/** Whether the Registro Otros contratos module is enabled for the active tenant. */
export const REGISTRO_OTROS_CONTRATOS_ENABLED = isModuleEnabled(MODULE_IDS.registroOtrosContratos);

/** Tab labels on the Otros contratos module (tenant config). */
export const REGISTRO_OTROS_CONTRATOS_TAB_NAMES = cfg.registroOtrosContratosTabNames;

/** Tabs reachable with current tenant credentials. */
export const REGISTRO_OTROS_CONTRATOS_ENABLED_TAB_NAMES = getModuleEnabledTabNames(
  MODULE_IDS.registroOtrosContratos,
);

export const REGISTRO_OTROS_CONTRATOS_LOCKED_TAB_NAMES = cfg.registroOtrosContratosLockedTabNames;

/** Miscelaneos grid columns (standard set plus Producto Facturable). */
export const REGISTRO_OTROS_CONTRATOS_MISC_CONTRACT_COLUMNS =
  cfg.registroOtrosContratosMiscContractColumns;

/** AGR grid columns (standard contract set, no Producto Facturable). */
export const REGISTRO_OTROS_CONTRATOS_AGR_CONTRACT_COLUMNS =
  cfg.registroOtrosContratosAgrContractColumns;

/**
 * Navigation and assertions for the Otros contratos submodule under Registro.
 */
export class RegistroOtrosContratosNavigationPage extends RegistroNavigationBasePage {
  /** URL slug segment per Otros contratos tab (tenant config). */
  static readonly REGISTRO_OTROS_CONTRATOS_TAB_SLUGS: Record<string, RegExp> = toTabSlugRecord(
    cfg.registroOtrosContratosTabSlugs,
  );

  /** Breadcrumb third-segment text per active tab. */
  static readonly REGISTRO_OTROS_CONTRATOS_TAB_BREADCRUMBS: Record<string, string> =
    cfg.registroOtrosContratosTabBreadcrumbs;

  /**
   * Expands Registro and the Otros contratos submodule dropdown in the sidebar.
   */
  async expandOtrosContratosSidebar(): Promise<void> {
    await this.expandRegistroSubmodule('Otros contratos');
  }

  /**
   * Re-expands Registro and Otros contratos when navigation collapsed the sidebar flyouts.
   */
  async ensureOtrosContratosSidebarExpanded(): Promise<void> {
    await this.ensureRegistroSubmoduleNestedLinksVisible('Otros contratos', 'Miscelaneos');
  }

  /**
   * Clicks an Otros contratos tab link inside the expanded sidebar submenu.
   */
  async clickOtrosContratosSidebarLink(tabName: RegistroOtrosContratosTabName): Promise<void> {
    await this.ensureOtrosContratosSidebarExpanded();
    const submenu = this.registroSubmenu();
    const link = submenu.getByRole('link', { name: tabName });
    if ((await link.count()) > 0) {
      await this.clickRegistroSubmenuLink(tabName);
    } else {
      await submenu.getByRole('menuitem', { name: tabName }).first().click();
    }
    await expect(this.page).toHaveURL(
      RegistroOtrosContratosNavigationPage.REGISTRO_OTROS_CONTRATOS_TAB_SLUGS[tabName],
      { timeout: 15_000 },
    );
  }

  /**
   * Opens an Otros contratos tab via sidebar nested links under Otros contratos.
   */
  async openOtrosContratosFromSidebar(
    entryLink: RegistroOtrosContratosTabName = 'Miscelaneos',
  ): Promise<void> {
    await this.expandOtrosContratosSidebar();
    await this.clickOtrosContratosSidebarLink(entryLink);
  }

  /**
   * Opens Otros contratos from the dashboard grid (eye affordance under the Registro card).
   */
  async openOtrosContratosFromDashboardGrid(): Promise<void> {
    await this.hoverRegistroDashboardCard();
    await this.registroDashboardCard()
      .getByRole('listitem')
      .filter({ hasText: 'Otros contratos' })
      .getByLabel('eye')
      .click();
  }

  /**
   * Path B: asserts the Registro card pinned rows, hovers to reveal Otros contratos, opens it, and lands on Miscelaneos.
   */
  async openOtrosContratosFromDashboardHover(): Promise<void> {
    const card = this.registroDashboardCard();
    await expect(card).toBeVisible();
    for (const label of ['Empresas', 'Cttos energía', 'Cttos combustible'] as const) {
      await expect(card.getByText(label)).toBeVisible();
      await expect(
        card.getByRole('listitem').filter({ hasText: label }).getByLabel('eye'),
      ).toBeVisible();
    }
    await this.expectOtrosContratosVisibleOnDashboardHover();
    await this.openOtrosContratosFromDashboardGrid();
    await this.expectGestorDeDatosOtrosContratosShell();
    await this.expectOtrosContratosTabActive('Miscelaneos');
  }

  /**
   * Asserts nested Otros contratos sidebar items: Miscelaneos href, AGR enabled, locked tabs, Contratos MISC absent.
   */
  async expectOtrosContratosNestedSidebarItems(): Promise<void> {
    await this.expandOtrosContratosSidebar();
    const submenu = this.registroSubmenu();
    await expect(submenu.getByRole('link', { name: 'Miscelaneos' })).toHaveAttribute(
      'href',
      '/gestor-de-datos/otros-contratos/miscelaneos',
    );
    await expect(submenu.getByRole('menuitem', { name: 'AGR' })).toBeVisible();
    await expect(submenu.getByRole('menuitem', { name: 'AGR', disabled: true })).toHaveCount(0);
    for (const tabName of REGISTRO_OTROS_CONTRATOS_LOCKED_TAB_NAMES) {
      await expect(submenu.getByRole('menuitem', { name: tabName, disabled: true })).toBeVisible();
    }
    await expect(submenu.getByRole('link', { name: 'Contratos MISC', exact: true })).toHaveCount(0);
    await expect(submenu.getByRole('menuitem', { name: 'Contratos MISC', exact: true })).toHaveCount(0);
  }

  /**
   * Asserts Otros contratos is listed on the Registro dashboard hover card with an eye affordance.
   */
  async expectOtrosContratosVisibleOnDashboardHover(): Promise<void> {
    await this.hoverRegistroDashboardCard();
    const row = this.registroDashboardCard()
      .getByRole('listitem')
      .filter({ hasText: 'Otros contratos' });
    await expect(row).toBeVisible();
    await expect(row.getByLabel('eye')).toBeVisible();
  }

  /**
   * Asserts the first main contract table has no Select all column header.
   */
  async expectSelectAllColumnAbsent(): Promise<void> {
    await expect(
      this.gestorMain().getByRole('table').first().getByRole('columnheader', { name: 'Select all' }),
    ).toHaveCount(0);
  }

  /**
   * Asserts Otros contratos gestor shell: URL, breadcrumb, and enabled/locked tab strip.
   */
  async expectGestorDeDatosOtrosContratosShell(): Promise<void> {
    await expect(this.page).toHaveURL(/gestor-de-datos\/(otros-contratos|contratos-energia)\//);
    const breadcrumb = this.page.getByRole('navigation');
    await expect(breadcrumb).toContainText('Gestor de datos');
    for (const tabName of REGISTRO_OTROS_CONTRATOS_ENABLED_TAB_NAMES) {
      await expect(this.page.getByRole('tab', { name: tabName })).toBeVisible();
      await expect(this.page.getByRole('tab', { name: tabName })).toBeEnabled();
    }
    for (const tabName of REGISTRO_OTROS_CONTRATOS_LOCKED_TAB_NAMES) {
      const tab = this.page.getByRole('tab', { name: tabName });
      await expect(tab).toBeVisible();
      await expect(tab).toBeDisabled();
    }
  }

  /**
   * Opens an Otros contratos tab and asserts selection, breadcrumb, and URL slug.
   */
  async openOtrosContratosTab(tabName: RegistroOtrosContratosTabName): Promise<void> {
    await this.page.getByRole('tab', { name: tabName }).click();
    await this.expectOtrosContratosTabActive(tabName);
  }

  /**
   * Asserts the tab is selected, breadcrumb shows the configured segment, and URL matches the slug.
   */
  async expectOtrosContratosTabActive(tabName: RegistroOtrosContratosTabName): Promise<void> {
    await expect(this.page).toHaveURL(
      RegistroOtrosContratosNavigationPage.REGISTRO_OTROS_CONTRATOS_TAB_SLUGS[tabName],
      { timeout: 15_000 },
    );
    const tab = this.page.getByRole('tab', { name: tabName });
    await expect(tab).toBeVisible();
    await expect(tab).toHaveAttribute('aria-selected', 'true');
    await expect(this.page.getByRole('navigation')).toContainText(
      RegistroOtrosContratosNavigationPage.REGISTRO_OTROS_CONTRATOS_TAB_BREADCRUMBS[tabName],
    );
  }

  /**
   * Asserts Otros contratos toolbar: search, Filtros, Nuevo Registro, and no Modo Yo / Estado / Usuarios chips.
   */
  async expectOtrosContratosToolbar(): Promise<void> {
    const main = this.gestorMain();
    await expect(main.getByRole('searchbox', { name: /Buscar/i })).toBeVisible();
    await this.expectFiltrosControlVisible();
    await this.expectToolbarFilterChipsAbsent();
    await expect(main.getByRole('button', { name: 'Nuevo Registro' })).toBeVisible();
    await expect(main.getByRole('button', { name: 'Nuevo Contrato' })).toHaveCount(0);
  }

  /**
   * Asserts contract grid column headers in the first main table; Acciones is optional visibility only.
   */
  async expectContractGridColumnHeaders(columnNames: readonly string[]): Promise<void> {
    const table = this.gestorMain().getByRole('table').first();
    await assertTableColumnHeadersMatchConfig(table, columnNames, {
      additionalAllowedColumns: ['Acciones'],
    });
  }

  /**
   * Opens Miscelaneos Nuevo Registro, validates fields and dropdowns (no wizard steps), then closes.
   */
  async expectMiscNuevoRegistroDialogOpensAndCloses(): Promise<void> {
    await this.expectRegistroWizardDialogOpensAndCloses({
      fieldAssertOptions: REGISTRO_WIZARD_FIELD_ASSERT_ENERGIA,
      ctaName: 'Nuevo Registro',
      stepTitle: 'Registrar Información',
      fields: cfg.registroOtrosContratosMiscNuevoRegistroFields,
      dropdownOptions: cfg.registroOtrosContratosMiscNuevoRegistroFieldsDropdownOptions,
      footerVariant: 'misc',
      absentWizardSteps: ['Código SIC', 'Datos macro', 'Carga archivos'],
    });
  }

  /**
   * Opens AGR Nuevo Registro, validates fields without Producto Facturable (no wizard steps), then closes.
   */
  async expectAgrNuevoRegistroDialogOpensAndCloses(): Promise<void> {
    const fields = cfg.registroOtrosContratosMiscNuevoRegistroFields.filter(
      (field) => field.label !== 'Producto Facturable',
    );
    const dropdownOptions = Object.fromEntries(
      Object.entries(cfg.registroOtrosContratosMiscNuevoRegistroFieldsDropdownOptions).filter(
        ([label]) => label !== 'Producto Facturable',
      ),
    );

    await this.expectRegistroWizardDialogOpensAndCloses({
      fieldAssertOptions: {
        ...REGISTRO_WIZARD_FIELD_ASSERT_ENERGIA,
        allowExtraDropdownOptions: true,
      },
      ctaName: 'Nuevo Registro',
      stepTitle: 'Registrar Información',
      fields,
      dropdownOptions,
      footerVariant: 'misc',
      absentWizardSteps: ['Código SIC', 'Datos macro', 'Carga archivos'],
    });
  }
}
