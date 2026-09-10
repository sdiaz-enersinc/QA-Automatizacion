import { expect } from '@playwright/test';
import { getRegistroHistorialConfig, getModuleEnabledTabNames, isModuleEnabled, toTabSlugRecord } from '../../config/load-tenant-config';
import { MODULE_IDS } from '../../config/module-registry';
import type { RegistroHistorialTabName } from '../../config/types/registro-historial';
import { RegistroNavigationBasePage } from './registro-navigation-base';
import { assertTableColumnHeadersMatchConfig } from '../../registro/table-column-headers';

export type { RegistroHistorialTabName };

const cfg = getRegistroHistorialConfig();

/** Indica si el módulo Registro Historial está habilitado para el tenant activo. */
export const REGISTRO_HISTORIAL_ENABLED = isModuleEnabled(MODULE_IDS.registroHistorial);

/** Etiquetas de pestaña del módulo Historial (config del tenant). */
export const REGISTRO_HISTORIAL_TAB_NAMES = cfg.registroHistorialTabNames;

/** Pestañas alcanzables con las credenciales actuales del tenant. */
export const REGISTRO_HISTORIAL_ENABLED_TAB_NAMES = getModuleEnabledTabNames(MODULE_IDS.registroHistorial);

export const REGISTRO_HISTORIAL_LOCKED_TAB_NAMES = cfg.registroHistorialLockedTabNames;

/** Encabezados de columna de la grilla Operaciones multiples (config del tenant). */
export const REGISTRO_HISTORIAL_OPERACIONES_MULTIPLES_COLUMNS =
  cfg.registroHistorialOperacionesMultiplesColumns;

/** Encabezados de columna de la grilla Operaciones individuales (config del tenant). */
export const REGISTRO_HISTORIAL_OPERACIONES_INDIVIDUALES_COLUMNS =
  cfg.registroHistorialOperacionesIndividualesColumns;

/** Encabezados de columna de la grilla Archivos cargados (config del tenant). */
export const REGISTRO_HISTORIAL_ARCHIVOS_CARGADOS_COLUMNS =
  cfg.registroHistorialArchivosCargadosColumns;

/**
 * Navegación y aserciones del submódulo Historial bajo Registro.
 */
export class RegistroHistorialNavigationPage extends RegistroNavigationBasePage {
  /** Segmento de slug de URL por pestaña de Historial (config del tenant). */
  static readonly REGISTRO_HISTORIAL_TAB_SLUGS: Record<string, RegExp> = toTabSlugRecord(
    cfg.registroHistorialTabSlugs,
  );

  /**
   * Texto del tercer segmento del breadcrumb por pestaña activa (config del tenant).
   * PROBLEMA CONOCIDO: las dos primeras pestañas usan etiquetas legacy del slug, no el texto de la pestaña.
   */
  static readonly REGISTRO_HISTORIAL_TAB_BREADCRUMBS: Record<string, string> =
    cfg.registroHistorialTabBreadcrumbs;

  /** Href del enlace anidado del menú lateral por pestaña (config del tenant). */
  static readonly REGISTRO_HISTORIAL_SIDEBAR_HREFS: Record<string, string> =
    cfg.registroHistorialSidebarHrefs;

  /**
   * Asegura que Historial está expandido y que los enlaces anidados del menú lateral son visibles.
   */
  async ensureHistorialSidebarExpanded(
    anchorLinkName: RegistroHistorialTabName = 'Operaciones multiples',
  ): Promise<void> {
    await this.ensureRegistroSubmoduleNestedLinksVisible('Historial', anchorLinkName);
  }

  /**
   * Comprueba que Historial aparece en el submenú expandido de Registro.
   */
  async expectHistorialSubmenuEntryVisible(): Promise<void> {
    await this.expandRegistroSidebar();
    await expect(
      this.registroSubmenu().getByRole('menuitem', { name: 'Historial' }).first(),
    ).toBeVisible();
  }

  /**
   * Comprueba que Historial está expandido y que los enlaces anidados son visibles con los href esperados.
   */
  async expectHistorialNestedSidebarLinksVisible(): Promise<void> {
    await this.ensureHistorialSidebarExpanded();
    const row = this.registroSubmenu().getByRole('menuitem', { name: 'Historial' }).first();
    await expect(row).toHaveAttribute('aria-expanded', 'true');
    for (const tabName of REGISTRO_HISTORIAL_TAB_NAMES) {
      const link = this.registroSubmenu().getByRole('link', { name: tabName }).first();
      await link.scrollIntoViewIfNeeded();
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute(
        'href',
        RegistroHistorialNavigationPage.REGISTRO_HISTORIAL_SIDEBAR_HREFS[tabName],
      );
    }
  }

  /**
   * Abre una pestaña de Historial por los enlaces anidados del menú lateral bajo Historial.
   */
  async openHistorialFromSidebar(tabName: RegistroHistorialTabName): Promise<void> {
    await expect(async () => {
      await this.ensureRegistroSubmoduleNestedLinksVisible('Historial', tabName);
      const link = this.registroSubmenu().getByRole('link', { name: tabName }).first();
      await link.scrollIntoViewIfNeeded();
      await expect(link).toBeVisible();
      await link.click();
      await expect(this.page).toHaveURL(
        RegistroHistorialNavigationPage.REGISTRO_HISTORIAL_TAB_SLUGS[tabName],
      );
    }).toPass({ timeout: 20_000 });
  }

  /**
   * Abre Historial desde la grilla del tablero (icono ojo bajo la tarjeta Registro).
   */
  async openHistorialFromDashboardGrid(): Promise<void> {
    await expect(async () => {
      await this.hoverRegistroDashboardCard();
      const eye = this.registroDashboardCard()
        .getByRole('listitem')
        .filter({ hasText: 'Historial' })
        .getByLabel('eye');
      await expect(eye).toBeVisible();
      await eye.click();
    }).toPass({ timeout: 15_000 });
  }

  /**
   * Comprueba que el menú hover de la tarjeta Registro muestra Historial con el icono ojo.
   */
  async expectHistorialVisibleOnDashboardHover(): Promise<void> {
    await expect(async () => {
      await this.hoverRegistroDashboardCard();
      const card = this.registroDashboardCard();
      for (const label of ['Insumos oferta', 'Otros documentos', 'RPM', 'SIRECI', 'Historial']) {
        await expect(card.getByText(label, { exact: true })).toBeVisible();
      }
      await expect(
        card.getByRole('listitem').filter({ hasText: 'Historial' }).getByLabel('eye'),
      ).toBeVisible();
    }).toPass({ timeout: 15_000 });
  }

  /**
   * Comprueba el shell del gestor de Historial: URL, breadcrumb, tira de pestañas, búsqueda y grilla de datos.
   */
  async expectGestorDeDatosHistorialShell(): Promise<void> {
    await expect(this.page).toHaveURL(/gestor-de-datos\/historial\//);
    const breadcrumb = this.page.getByRole('navigation');
    await expect(breadcrumb).toContainText('Gestor de datos');
    await expect(breadcrumb).toContainText('Historial');
    for (const tabName of REGISTRO_HISTORIAL_TAB_NAMES) {
      await expect(this.page.getByRole('tab', { name: tabName })).toBeVisible();
    }
    await expect(this.gestorMain().getByRole('searchbox', { name: /Buscar/i })).toBeVisible();
    await expect(this.gestorMain().getByRole('table').first()).toBeVisible();
  }

  /**
   * Comprueba que la pestaña está seleccionada, el breadcrumb muestra el segmento legacy y la URL coincide con el slug.
   */
  async expectHistorialViewActive(tabName: RegistroHistorialTabName): Promise<void> {
    await expect(this.page).toHaveURL(
      RegistroHistorialNavigationPage.REGISTRO_HISTORIAL_TAB_SLUGS[tabName],
      {
        timeout: 15_000,
      },
    );
    const tab = this.page.getByRole('tab', { name: tabName });
    await expect(tab).toBeVisible();
    await expect(tab).toHaveAttribute('aria-selected', 'true');
    await expect(this.page.getByRole('navigation')).toContainText(
      RegistroHistorialNavigationPage.REGISTRO_HISTORIAL_TAB_BREADCRUMBS[tabName],
    );
    await expect(this.gestorMain().getByRole('table').first()).toBeVisible({ timeout: 15_000 });
  }

  /**
   * Comprueba el desajuste conocido entre etiqueta de pestaña y breadcrumb/URL en las pestañas legacy de Historial.
   */
  async expectHistorialTabBreadcrumbDiscrepancy(tabName: RegistroHistorialTabName): Promise<void> {
    const breadcrumbSegment = RegistroHistorialNavigationPage.REGISTRO_HISTORIAL_TAB_BREADCRUMBS[tabName];
    await expect(this.page.getByRole('tab', { name: tabName })).toBeVisible();
    await expect(this.page.getByRole('navigation')).toContainText(breadcrumbSegment);
    await expect(this.page.getByRole('navigation')).not.toContainText(tabName);
    await expect(this.page).toHaveURL(
      RegistroHistorialNavigationPage.REGISTRO_HISTORIAL_TAB_SLUGS[tabName],
    );
  }

  /**
   * Abre una pestaña del módulo y comprueba URL, breadcrumb y estado aria-selected.
   * Reintenta si la SPA muestra un 404 transitorio en main tras el cambio de pestaña.
   */
  async openHistorialTab(tabName: RegistroHistorialTabName): Promise<void> {
    await expect(async () => {
      const tab = this.page.getByRole('tab', { name: tabName });
      await tab.click();
      const main = this.gestorMain();
      if ((await main.getByText('404', { exact: true }).count()) > 0) {
        await this.page.goto(
          RegistroHistorialNavigationPage.REGISTRO_HISTORIAL_SIDEBAR_HREFS[tabName],
        );
      }
      await expect(this.page).toHaveURL(
        RegistroHistorialNavigationPage.REGISTRO_HISTORIAL_TAB_SLUGS[tabName],
      );
      await expect(this.page.getByRole('tab', { name: tabName })).toHaveAttribute(
        'aria-selected',
        'true',
      );
      await expect(this.page.getByRole('navigation')).toContainText(
        RegistroHistorialNavigationPage.REGISTRO_HISTORIAL_TAB_BREADCRUMBS[tabName],
      );
      await expect(main.getByText('404', { exact: true })).toHaveCount(0);
      await expect(main.getByRole('table').first()).toBeVisible();
    }).toPass({ timeout: 30_000 });
  }

  /**
   * Comprueba que todas las pestañas del módulo son visibles en la tira.
   */
  async expectHistorialTabStripVisible(): Promise<void> {
    for (const tabName of REGISTRO_HISTORIAL_TAB_NAMES) {
      await expect(this.page.getByRole('tab', { name: tabName })).toBeVisible();
    }
  }

  /**
   * Comprueba la barra de Historial: solo búsqueda y Filtros (chips Modo Yo/Estado/Usuarios ausentes en todas las pestañas).
   */
  async expectHistorialOperacionesToolbar(): Promise<void> {
    const main = this.gestorMain();
    await expect(main.getByRole('searchbox', { name: /Buscar/i })).toBeVisible();
    await this.expectFiltrosControlVisible();
    await this.expectToolbarFilterChipsAbsent();
  }

  /**
   * Comprueba los encabezados de columna de la primera grilla principal.
   */
  async expectGridColumnHeaders(columnNames: readonly string[]): Promise<void> {
    const table = this.gestorMain().getByRole('table').first();
    await assertTableColumnHeadersMatchConfig(table, columnNames);
  }
}
