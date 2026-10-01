import { expect } from '@playwright/test';
import { getRegistroOtrosDocumentosConfig, getModuleEnabledTabNames, isModuleEnabled, toTabSlugRecord } from '../../config/load-tenant-config';
import { MODULE_IDS } from '../../config/module-registry';
import type { RegistroOtrosDocumentosViewName } from '../../config/types/registro-otros-documentos';
import { RegistroNavigationBasePage } from './registro-navigation-base';
import { assertTableColumnHeadersMatchConfig } from '../../registro/table-column-headers';
import { assertTabStripMatchesConfig } from '../../registro/tab-strip';
import { assertSidebarLabelsMatchConfig } from '../../registro/sidebar-labels';

export type { RegistroOtrosDocumentosViewName };

const cfg = getRegistroOtrosDocumentosConfig();

/** Indica si el módulo Registro Otros documentos está habilitado para el tenant activo. */
export const REGISTRO_OTROS_DOCUMENTOS_ENABLED = isModuleEnabled(MODULE_IDS.registroOtrosDocumentos);

/** Todas las vistas de menú/pestaña de Otros documentos (config del tenant). */
export const REGISTRO_OTROS_DOCUMENTOS_VIEW_NAMES = cfg.registroOtrosDocumentosViewNames;

/** Vistas alcanzables con las credenciales actuales del tenant. */
export const REGISTRO_OTROS_DOCUMENTOS_ENABLED_VIEW_NAMES = getModuleEnabledTabNames(
  MODULE_IDS.registroOtrosDocumentos,
);

/** Vista de aterrizaje usada como ancla del menú lateral y semilla. */
export const REGISTRO_OTROS_DOCUMENTOS_DEFAULT_VIEW = cfg.registroOtrosDocumentosDefaultView;

/** Etiqueta de vista Hidrologia Horaria (config del tenant). */
export const REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_HORARIA_VIEW =
  cfg.registroOtrosDocumentosHidrologiaHorariaView;

/** Etiqueta de vista Hidrologia Diaria (config del tenant). */
export const REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_DIARIA_VIEW =
  cfg.registroOtrosDocumentosHidrologiaDiariaView;

/** Etiqueta de vista Contadores Frt (config del tenant). */
export const REGISTRO_OTROS_DOCUMENTOS_CONTADORES_FRT_VIEW =
  cfg.registroOtrosDocumentosContadoresFrtView;

/** Etiqueta de vista Contadores INTI (config del tenant). */
export const REGISTRO_OTROS_DOCUMENTOS_CONTADORES_INTI_VIEW =
  cfg.registroOtrosDocumentosContadoresIntiView;

/**
 * Vistas de Hidrologia, derivadas de las claves Horaria y Diaria.
 * Conservado para path-a, path-b-hidrologia-tabs y toolbar hasta que esos specs se partan.
 */
export const REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_VIEWS: readonly string[] = [
  REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_HORARIA_VIEW,
  REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_DIARIA_VIEW,
];

/**
 * Vistas de Contadores, derivadas de las claves Frt e INTI.
 * Conservado para path-a, path-b-contadores-tabs y toolbar hasta que esos specs se partan.
 */
export const REGISTRO_OTROS_DOCUMENTOS_CONTADORES_VIEWS: readonly string[] = [
  REGISTRO_OTROS_DOCUMENTOS_CONTADORES_FRT_VIEW,
  REGISTRO_OTROS_DOCUMENTOS_CONTADORES_INTI_VIEW,
];

/** Encabezados de columna de la grilla Hidrologia Horaria (config del tenant). */
export const REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_HORARIA_COLUMNS =
  cfg.registroOtrosDocumentosHidrologiaHorariaColumns;

/** Encabezados de columna de la grilla Hidrologia Diaria (config del tenant). */
export const REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_DIARIA_COLUMNS =
  cfg.registroOtrosDocumentosHidrologiaDiariaColumns;

/** Encabezados de columna de la grilla Contadores Frt / INTI (config del tenant). */
export const REGISTRO_OTROS_DOCUMENTOS_CONTADORES_COLUMNS =
  cfg.registroOtrosDocumentosContadoresColumns;

/** Etiquetas de grupos anidados del menú lateral bajo Otros documentos (valores únicos de la config del tenant). */
export const REGISTRO_OTROS_DOCUMENTOS_NESTED_GROUPS = [
  ...new Set(Object.values(cfg.registroOtrosDocumentosNestedGroup)),
];

type OtrosDocumentosNestedGroup = 'Hidrologia' | 'Contadores';

/**
 * Navegación y aserciones del submódulo Otros documentos bajo Registro.
 */
export class RegistroOtrosDocumentosNavigationPage extends RegistroNavigationBasePage {
  /** Segmento de slug de URL por vista de Otros documentos (config del tenant). */
  static readonly REGISTRO_OTROS_DOCUMENTOS_VIEW_SLUGS: Record<string, RegExp> = toTabSlugRecord(
    cfg.registroOtrosDocumentosViewSlugs,
  );

  /** Texto del tercer segmento del breadcrumb por vista activa (config del tenant). */
  static readonly REGISTRO_OTROS_DOCUMENTOS_VIEW_BREADCRUMBS: Record<string, string> =
    cfg.registroOtrosDocumentosViewBreadcrumbs;

  /** Grupo del desplegable anidado del menú lateral por vista (config del tenant). */
  static readonly REGISTRO_OTROS_DOCUMENTOS_NESTED_GROUP: Record<string, OtrosDocumentosNestedGroup> =
    cfg.registroOtrosDocumentosNestedGroup as Record<string, OtrosDocumentosNestedGroup>;

  /** Pestaña pareja de navegación cruzada dentro de cada par (config del tenant). */
  static readonly REGISTRO_OTROS_DOCUMENTOS_TAB_PAIR_MATE: Record<string, string> =
    cfg.registroOtrosDocumentosTabPairMate;

  /**
   * Expande Registro y el desplegable del submódulo Otros documentos en el menú lateral.
   */
  async expandOtrosDocumentosSidebar(): Promise<void> {
    await this.expandRegistroSubmodule('Otros documentos');
  }

  /**
   * Expande un grupo anidado del menú lateral (Hidrologia o Contadores) bajo Otros documentos.
   *
   * @param group - Grupo del desplegable anidado bajo Otros documentos.
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
   * Comprueba que los grupos anidados de Otros documentos coinciden exactamente con la config del tenant (Hidrologia / Contadores).
   */
  async expectOtrosDocumentosSubmenuGroupsVisible(): Promise<void> {
    await this.expandOtrosDocumentosSidebar();
    await assertSidebarLabelsMatchConfig(
      this.registroSubmoduleNestedItems(),
      REGISTRO_OTROS_DOCUMENTOS_NESTED_GROUPS,
      { context: 'Otros documentos nested groups' },
    );
  }

  /**
   * Abre una vista de Otros documentos por los ítems de menú anidados del menú lateral.
   *
   * @param viewName - Etiqueta de vista habilitada.
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
   * Abre una pestaña del módulo y comprueba URL, breadcrumb y estado aria-selected.
   *
   * @param viewName - Etiqueta de pestaña destino.
   */
  async openOtrosDocumentosTab(viewName: RegistroOtrosDocumentosViewName): Promise<void> {
    await this.page.getByRole('tab', { name: viewName, exact: true }).click();
    await this.expectOtrosDocumentosViewActive(viewName);
  }

  /**
   * Comprueba que la pestaña de la vista está seleccionada, el breadcrumb coincide, el slug de URL coincide y la grilla principal es visible.
   *
   * @param viewName - Etiqueta de vista activa esperada.
   */
  async expectOtrosDocumentosViewActive(viewName: RegistroOtrosDocumentosViewName): Promise<void> {
    await expect(this.page).toHaveURL(
      RegistroOtrosDocumentosNavigationPage.REGISTRO_OTROS_DOCUMENTOS_VIEW_SLUGS[viewName],
      {
        timeout: 15_000,
      },
    );
    const tab = this.page.getByRole('tab', { name: viewName, exact: true });
    await expect(tab).toBeVisible();
    await expect(tab).toHaveAttribute('aria-selected', 'true');
    await expect(this.page.getByRole('navigation')).toContainText(
      RegistroOtrosDocumentosNavigationPage.REGISTRO_OTROS_DOCUMENTOS_VIEW_BREADCRUMBS[viewName],
    );
    await expect(this.gestorMain().getByRole('table').first()).toBeVisible();
  }

  /**
   * Comprueba que la tira de pestañas coincide con el par activo y que la pestaña pareja es visible pero no está seleccionada.
   *
   * @param viewName - Vista activa cuya pareja debe ser visible.
   */
  async expectOtrosDocumentosPairTabVisible(viewName: RegistroOtrosDocumentosViewName): Promise<void> {
    await assertTabStripMatchesConfig(this.page, {
      enabledTabs: this.activeOtrosDocumentosPairViews(),
      context: 'Otros documentos',
    });
    const mate = RegistroOtrosDocumentosNavigationPage.REGISTRO_OTROS_DOCUMENTOS_TAB_PAIR_MATE[viewName];
    const mateTab = this.page.getByRole('tab', { name: mate, exact: true });
    await expect(mateTab).toBeVisible();
    await expect(mateTab).toHaveAttribute('aria-selected', 'false');
  }

  /**
   * Comprueba la barra de Otros documentos: búsqueda, chips de filtro, Cargar archivo y ausencia del chip Filtros.
   */
  async expectOtrosDocumentosToolbar(): Promise<void> {
    const main = this.gestorMain();
    await expect(main.getByRole('searchbox', { name: /Buscar/i })).toBeVisible();
    await this.expectFiltrosControlAbsent();
    await this.expectToolbarFilterChipsAbsent();
    await expect(main.getByRole('button', { name: 'Cargar archivo' })).toBeVisible();
  }

  /**
   * Abre una vista de Otros documentos con un enlace directo al slug del tenant (solución alternativa al menú lateral).
   *
   * @param viewName - Etiqueta de vista habilitada.
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
   * Comprueba el shell del gestor de Otros documentos: URL, breadcrumb y las pestañas del par activo.
   */
  async expectGestorDeDatosOtrosDocumentosShell(): Promise<void> {
    await expect(this.page).toHaveURL(/gestor-de-datos\/otros-documentos\//);
    await expect(this.page.getByRole('navigation')).toContainText('Gestor de datos');
    await assertTabStripMatchesConfig(this.page, {
      enabledTabs: this.activeOtrosDocumentosPairViews(),
      context: 'Otros documentos',
    });
  }

  /**
   * Comprueba los encabezados de columna de la primera grilla principal.
   *
   * @param columnNames - Etiquetas esperadas de encabezado de columna.
   */
  async expectGridColumnHeaders(columnNames: readonly string[]): Promise<void> {
    const table = this.gestorMain().getByRole('table').first();
    await assertTableColumnHeadersMatchConfig(table, columnNames);
  }

  /**
   * Comprueba las columnas de la grilla y los extras específicos de cada layout de Otros documentos.
   *
   * @param viewName - Etiqueta de vista activa de Hidrologia o Contadores.
   */
  async expectOtrosDocumentosLayout(viewName: RegistroOtrosDocumentosViewName): Promise<void> {
    await this.expectGridColumnHeaders(this.columnsForView(viewName));
    if (viewName === REGISTRO_OTROS_DOCUMENTOS_CONTADORES_FRT_VIEW) {
      await this.expectOtrosDocumentosPairTabVisible(viewName);
      await this.expectContadoresFrtSampleRows();
      return;
    }
    if (viewName === REGISTRO_OTROS_DOCUMENTOS_CONTADORES_INTI_VIEW) {
      await this.expectNoErrorBanner();
      return;
    }
    if (viewName === REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_HORARIA_VIEW) {
      await this.expectGridPaginationFooter();
      return;
    }
    if (viewName === REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_DIARIA_VIEW) {
      await this.expectGridHasDataOrEmptyState();
    }
  }

  /**
   * Comprueba el pie de paginación con el recuento de ítems y el selector de tamaño de página por defecto.
   */
  async expectGridPaginationFooter(): Promise<void> {
    const main = this.gestorMain();
    await expect(main.getByText(/Total \d+ items?/)).toBeVisible();
    await expect(main.getByText('15 / página')).toBeVisible();
  }

  /**
   * Comprueba que la grilla muestra al menos una fila de datos o un encabezado explícito de estado vacío.
   */
  async expectGridHasDataOrEmptyState(): Promise<void> {
    const main = this.gestorMain();
    await expect(main.getByRole('table').first()).toBeVisible();
    const empty = main.getByRole('heading', { name: 'No se encontraron datos' });
    const dataCell = main.locator('table tbody tr td').first();
    await expect(empty.or(dataCell)).toBeVisible();
  }

  /**
   * Comprueba que las filas de muestra de Contadores Frt incluyen códigos de Frontera con prefijo Frt.
   */
  async expectContadoresFrtSampleRows(): Promise<void> {
    await expect(this.gestorMain().getByRole('table').first().getByText(/^Frt/)).toBeVisible();
  }

  /**
   * Comprueba que no se muestra un banner de error de la aplicación en la vista actual.
   */
  async expectNoErrorBanner(): Promise<void> {
    await expect(this.page.getByText('404')).toHaveCount(0);
    await expect(this.page.getByText(/Configuración no encontrada/i)).toHaveCount(0);
  }

  /**
   * Abre el diálogo de subida Cargar archivo, valida la zona de carga y Guardar, y lo cierra.
   */
  async expectCargarArchivoDialogOpensAndCloses(): Promise<void> {
    await this.expectFileUploadDialogOpensAndCloses('Cargar archivo');
    await expect(this.gestorMain().getByRole('table').first()).toBeVisible();
  }

  /**
   * Pasa el cursor sobre la tarjeta Registro del tablero y comprueba que Otros documentos aparece con un icono ojo.
   */
  async expectOtrosDocumentosVisibleOnDashboardHover(): Promise<void> {
    await this.expectRegistroDashboardHoverSubmoduleVisible(
      'Otros documentos',
      this.registroDashboardHoverLabelsFromInsumosOfertaThroughHistorial(),
    );
  }

  /**
   * Ruta B: comprueba las filas fijas de la tarjeta Registro, pasa el cursor para revelar Otros documentos y hace clic en el ojo.
   */
  async openOtrosDocumentosFromDashboardHover(): Promise<void> {
    await this.expectRegistroDashboardPreviewRowsVisible();
    await this.expectOtrosDocumentosVisibleOnDashboardHover();
    await this.openOtrosDocumentosFromDashboardGrid();
  }

  /**
   * Hace clic en el icono ojo de Otros documentos en la tarjeta Registro del tablero.
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
   * Devuelve las vistas de Hidrologia o Contadores que coinciden con la URL actual del gestor.
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
   * Devuelve los encabezados de columna configurados en el tenant para una vista de Otros documentos.
   *
   * @param viewName - Etiqueta de vista de Hidrologia o Contadores.
   */
  private columnsForView(viewName: RegistroOtrosDocumentosViewName): readonly string[] {
    const columnsByView: Record<string, readonly string[]> = {
      [REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_HORARIA_VIEW]:
        REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_HORARIA_COLUMNS,
      [REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_DIARIA_VIEW]:
        REGISTRO_OTROS_DOCUMENTOS_HIDROLOGIA_DIARIA_COLUMNS,
    };
    for (const contadoresView of REGISTRO_OTROS_DOCUMENTOS_CONTADORES_VIEWS) {
      columnsByView[contadoresView] = REGISTRO_OTROS_DOCUMENTOS_CONTADORES_COLUMNS;
    }
    const columns = columnsByView[viewName];
    if (!columns) {
      throw new Error(`No hay configuración de columnas para la vista de Otros documentos: ${viewName}`);
    }
    return columns;
  }

  /**
   * Comprueba que la entrada hover del tablero aterriza en la URL raíz rota de Otros documentos con un banner 404.
   */
  async expectOtrosDocumentosDashboard404(): Promise<void> {
    await expect(this.page).toHaveURL(/gestor-de-datos\/otros-documentos\/?$/);
    await expect(this.page.getByText('404')).toBeVisible();
    await expect(this.page.getByText(/Configuración no encontrada/i)).toBeVisible();
    await expect(this.page.getByRole('tablist')).toHaveCount(0);
  }
}
