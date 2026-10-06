import { Locator, Page, expect } from '@playwright/test';
import { getRegistroNavigationConfig } from '../../config/load-tenant-config';
import { collectAntSelectDropdownOptionsInBrowser } from '../../ant-select-collect-options';
import {
  isRegistroWizardDropdownMinimum,
  type RegistroWizardFieldDefinition,
  type RegistroWizardDropdownOptionsMap,
} from '../../config/types/registro-wizard';
import { assertRegistroWizardFieldsMatchConfig } from '../../registro/form-field-labels';
import { assertSidebarLabelsMatchConfig } from '../../registro/sidebar-labels';
import {
  registroDashboardHoverLabelsEmpresasContext,
  registroDashboardHoverLabelsFromInsumosOfertaThroughHistorial,
  REGISTRO_NAVIGATION_DASHBOARD_PREVIEW_LABELS,
  REGISTRO_NAVIGATION_LEGACY_SUBMODULE_LABELS,
} from '../../registro/navigation-dashboard-labels';

export type {
  RegistroWizardFieldKind,
  RegistroWizardFieldDefinition,
  RegistroWizardDropdownExpectation,
  RegistroWizardDropdownOptionsMap,
} from '../../config/types/registro-wizard';

const navigationCfg = getRegistroNavigationConfig();

/** Etiquetas exactas del submenú bajo Registro en QA (copia del menú lateral y del tablero). */
export const REGISTRO_NAVIGATION_SUBMENU_LABELS = navigationCfg.registroNavigationSubmenuLabels;

/** Texto de la zona de carga mostrado en los diálogos de subida de archivos de Registrar Información (singular o plural). */
export const REGISTRO_CARGAR_ARCHIVO_DROPZONE_TEXT =
  /Haga clic aquí o arrastre (?:un archivo|los archivos) a esta área para preparar la carga/;

/** Cómo cerrar un select de Ant Design abierto sin cerrar el modal del asistente. */
export type RegistroWizardDismissDropdownStrategy = 'heading-click' | 'escape';

/** Sobrescrituras por módulo para las aserciones de campos del asistente (combustible vs energía). */
export interface RegistroWizardFieldAssertOptions {
  /** Si es true, los localizadores de combobox recurren a una búsqueda acotada al form-item (energía). */
  comboboxFormItemFallback?: boolean;
  dismissDropdownStrategy?: RegistroWizardDismissDropdownStrategy;
  /** Vuelve a comprobar el pie del diálogo tras cada interacción de combobox (energía). */
  assertFooterAfterCombobox?: boolean;
  /** Hace clic forzado en un combobox deshabilitado y comprueba que el desplegable permanece cerrado (energía). */
  assertDisabledComboboxNoDropdown?: boolean;
  /** Si es true, solo comprueba que los campos de la config existen en la UI (subconjunto). Por defecto: coincidencia exacta del conjunto de campos. */
  allowExtraFields?: boolean;
  /** Si es true, abre el asistente con el helper de clic reintentable de Registrar Información. */
  retryOpen?: boolean;
}

/** Perfil de aserción de campos para los asistentes de Contratos combustible. */
export const REGISTRO_WIZARD_FIELD_ASSERT_COMBUSTIBLE: RegistroWizardFieldAssertOptions = {
  dismissDropdownStrategy: 'heading-click',
};

/** Perfil de aserción de campos para los asistentes de Contratos energía. */
export const REGISTRO_WIZARD_FIELD_ASSERT_ENERGIA: RegistroWizardFieldAssertOptions = {
  comboboxFormItemFallback: true,
  dismissDropdownStrategy: 'escape',
  assertFooterAfterCombobox: true,
  assertDisabledComboboxNoDropdown: true,
  retryOpen: true,
};

/** Opciones para abrir un asistente, validar los campos y desplegables del paso 1, y cerrarlo. */
export interface RegistroWizardDialogOpensAndClosesOptions {
  ctaName: string | RegExp;
  stepTitle: string | RegExp;
  wizardSteps?: readonly string[];
  fields: readonly RegistroWizardFieldDefinition[];
  dropdownOptions: RegistroWizardDropdownOptionsMap;
  assertScrollableForm?: boolean;
  /** `standard`: asistente multipaso (Cancelar + Siguiente). `misc`: formulario en un paso (Cancelar, sin Siguiente). */
  footerVariant?: 'standard' | 'misc';
  /** Etiquetas de paso del asistente que no deben aparecer (layout MISC de energía). */
  absentWizardSteps?: readonly string[];
  /** Etiquetas de campos spinbutton no modelados como tipos de asistente. */
  extraExpectedLabels?: readonly string[];
  spinbuttonLabels?: readonly string[];
  fieldAssertOptions?: RegistroWizardFieldAssertOptions;
}

/**
 * Navegación reutilizable de Registro (Gestor de datos) por el menú lateral o la grilla del tablero.
 */
export class RegistroNavigationBasePage {
  constructor(protected readonly page: Page) {}

  /**
   * Devuelve la tarjeta del módulo Registro en la grilla del tablero autenticado.
   * Acotada a main y desambiguada de otros mosaicos que mencionan «Registro».
   */
  registroDashboardCard(): Locator {
    return this.page
      .getByRole('main')
      .locator('div')
      .filter({ hasText: 'Registro' })
      .filter({ hasText: 'Cttos energía' })
      .first();
  }

  /** Región del menú lateral (landmark complementary). */
  protected sidebar(): Locator {
    return this.page.getByRole('complementary').first();
  }

  /**
   * Expande el menú lateral cuando el layout lo plegó tras una navegación dentro de la app.
   */
  async expandSidebarIfCollapsed(): Promise<void> {
    const unfold = this.page.getByRole('button', { name: 'menu-unfold' });
    if (await unfold.isVisible()) {
      await unfold.click();
      await expect(this.sidebar().getByRole('menuitem', { name: 'Inicio' })).toBeVisible();
    }
  }

  /** Menú de segundo nivel bajo Registro expandido. */
  protected registroSubmenu(): Locator {
    return this.sidebar().getByRole('menu').nth(1);
  }

  /**
   * Expande la sección Registro hasta que las filas de submódulo son visibles en el menú lateral.
   */
  async expandRegistroSidebar(): Promise<void> {
    await this.expandSidebarIfCollapsed();
    const registro = this.sidebar().getByRole('menuitem', { name: 'Registro' });
    const submenuRow = this.registroSubmenu()
      .getByRole('menuitem', { name: REGISTRO_NAVIGATION_SUBMENU_LABELS[0] })
      .first();
    await expect(async () => {
      if (!(await submenuRow.isVisible())) {
        await registro.click();
      }
      await expect(submenuRow).toBeVisible();
    }).toPass({ timeout: 10_000 });
  }

  /**
   * Expande un desplegable de submódulo de Registro (fila padre) en el menú lateral.
   */
  async expandRegistroSubmodule(submoduleLabel: string): Promise<void> {
    await this.expandRegistroSidebar();
    const submodule = this.registroSubmenu().getByRole('menuitem', { name: submoduleLabel }).first();
    await expect(async () => {
      if ((await submodule.getAttribute('aria-expanded')) !== 'true') {
        await submodule.click();
      }
      await expect(submodule).toHaveAttribute('aria-expanded', 'true');
    }).toPass({ timeout: 20_000 });
  }

  /**
   * Asegura que el desplegable de un submódulo expone al menos un enlace anidado del menú lateral.
   */
  protected async ensureRegistroSubmoduleNestedLinksVisible(
    submoduleLabel: string,
    anchorLinkName: string,
  ): Promise<void> {
    await this.expandRegistroSidebar();
    const row = this.registroSubmenu().getByRole('menuitem', { name: submoduleLabel }).first();
    const nestedLink = this.registroSubmenu().getByRole('link', { name: anchorLinkName }).first();
    await expect(async () => {
      if (!(await nestedLink.isVisible())) {
        await row.scrollIntoViewIfNeeded();
        await row.click();
      }
      await nestedLink.scrollIntoViewIfNeeded();
      await expect(nestedLink).toBeVisible();
    }).toPass({ timeout: 15_000 });
  }

  /**
   * Hace clic en un enlace anidado del menú lateral dentro del submenú expandido de Registro.
   */
  protected async clickRegistroSubmenuLink(linkName: string): Promise<void> {
    const link = this.registroSubmenu().getByRole('link', { name: linkName });
    await expect(link).toBeVisible();
    await link.scrollIntoViewIfNeeded();
    await link.click();
  }

  /**
   * Hace clic en el enlace navegable dentro de un desplegable de submódulo de Registro expandido.
   */
  async clickRegistroSubmoduleLink(linkName: string): Promise<void> {
    await this.clickRegistroSubmenuLink(linkName);
  }

  /**
   * Ítems de menú del desplegable anidado bajo una fila de submódulo de Registro expandida.
   */
  protected registroSubmoduleNestedItems(): Locator {
    return this.registroSubmenu().locator('[role=menu]').first().getByRole('menuitem');
  }

  /**
   * Comprueba que las etiquetas del submenú lateral de Registro coinciden exactamente con la config del tenant (sin extras).
   */
  async expectRegistroSubmenuLabelsVisible(): Promise<void> {
    await assertSidebarLabelsMatchConfig(
      this.registroSubmenu().getByRole('menuitem'),
      REGISTRO_NAVIGATION_SUBMENU_LABELS,
      { context: 'Registro submenu' },
    );
  }

  /**
   * Pasa el cursor sobre la tarjeta Registro del tablero para mostrar las opciones de navegación a submódulos.
   */
  async hoverRegistroDashboardCard(): Promise<void> {
    const card = this.page
      .getByRole('main')
      .getByRole('listitem')
      .filter({ hasText: 'Empresas' })
      .locator('xpath=ancestor::div[.//text()[normalize-space(.)="Registro"]][1]');
    await card.hover();
  }

  /**
   * Comprueba filas de contexto en el hover de la tarjeta Registro y que el submódulo objetivo tiene icono ojo.
   *
   * @param submoduleLabel - Texto de la fila de submódulo a abrir (p. ej. Empresas, Sireci).
   * @param contextLabels - Etiquetas adicionales que deben ser visibles en la tarjeta expandida.
   */
  protected async expectRegistroDashboardHoverSubmoduleVisible(
    submoduleLabel: string,
    contextLabels: readonly string[] = [],
  ): Promise<void> {
    await expect(async () => {
      await this.hoverRegistroDashboardCard();
      const card = this.registroDashboardCard();
      for (const label of contextLabels) {
        await expect(card.getByText(label, { exact: true })).toBeVisible();
      }
      const row = card.getByRole('listitem').filter({ hasText: submoduleLabel });
      await expect(row).toBeVisible();
      await expect(row.getByLabel('eye')).toBeVisible();
    }).toPass({ timeout: 15_000 });
  }

  /**
   * Comprueba las filas de vista previa de la tarjeta Registro (sin hover) con iconos ojo.
   */
  protected async expectRegistroDashboardPreviewRowsVisible(): Promise<void> {
    const card = this.registroDashboardCard();
    await expect(card).toBeVisible();
    for (const label of REGISTRO_NAVIGATION_DASHBOARD_PREVIEW_LABELS) {
      await expect(card.getByText(label, { exact: true })).toBeVisible();
      await expect(card.getByRole('listitem').filter({ hasText: label }).getByLabel('eye')).toBeVisible();
    }
  }

  /**
   * Comprueba que las etiquetas legacy de submódulo no aparecen en la tarjeta Registro del tablero.
   */
  protected async expectRegistroLegacySubmoduleAbsentOnDashboardCard(): Promise<void> {
    const card = this.registroDashboardCard();
    for (const label of REGISTRO_NAVIGATION_LEGACY_SUBMODULE_LABELS) {
      await expect(card.getByText(label, { exact: true })).toHaveCount(0);
    }
  }

  /** Etiquetas de contexto del hover para validaciones de Empresas en la tarjeta Registro. */
  protected registroDashboardHoverLabelsEmpresasContext(): readonly string[] {
    return registroDashboardHoverLabelsEmpresasContext();
  }

  /** Etiquetas de contexto del hover desde Insumos oferta hasta Historial (config del tenant). */
  protected registroDashboardHoverLabelsFromInsumosOfertaThroughHistorial(): readonly string[] {
    return registroDashboardHoverLabelsFromInsumosOfertaThroughHistorial();
  }

  /** Región de contenido principal de las grillas de Gestor de datos (Empresas, Contratos energía, etc.). */
  protected gestorMain(): Locator {
    return this.page.getByRole('main');
  }

  /**
   * Espera hasta que los overlays de modal de Ant Design y los nodos de diálogo estén completamente cerrados.
   */
  protected async expectNoVisibleModals(): Promise<void> {
    await this.dismissOpenSelectDropdowns();
    await expect(this.page.locator('[role="dialog"]:visible')).toHaveCount(0, { timeout: 10_000 });
    await expect(this.page.locator('.ant-modal-mask:visible')).toHaveCount(0, { timeout: 10_000 });
  }

  /**
   * Cierra cualquier portal de desplegable de select de Ant Design abierto que pueda interceptar clics de la barra.
   */
  protected async dismissOpenSelectDropdowns(): Promise<void> {
    const openDropdown = this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');
    if (await openDropdown.count()) {
      await this.page.keyboard.press('Escape');
      await expect(openDropdown).toHaveCount(0, { timeout: 5_000 });
    }
  }

  /**
   * Restablece el foco a un control neutro de la barra tras cerrar un modal o una interacción de calendario.
   */
  protected async resetGestorToolbarFocus(): Promise<void> {
    const main = this.gestorMain();
    const searchbox = main.getByRole('searchbox', { name: /Buscar/i });
    if (await searchbox.count()) {
      await searchbox.click();
      return;
    }
    const mesToggle = main.getByText('Mes', { exact: true });
    if (await mesToggle.count()) {
      await mesToggle.click();
    }
  }

  /**
   * Hace clic en un CTA de la barra y espera el diálogo Registrar Información, reintentando aperturas inestables.
   */
  protected async openRegistrarInformacionDialog(buttonName: string | RegExp): Promise<Locator> {
    const button = this.gestorMain().getByRole('button', { name: buttonName });
    const dialog = this.page.getByRole('dialog').filter({ hasText: 'Registrar Información' }).last();

    await this.dismissNotificationToasts();
    await this.expectNoVisibleModals();
    await this.resetGestorToolbarFocus();

    await expect(async () => {
      await button.scrollIntoViewIfNeeded();
      await expect(button).toBeEnabled();
      await button.click();
      if (!(await dialog.isVisible())) {
        await button.evaluate((element) => (element as HTMLButtonElement).click());
      }
      await expect(dialog).toBeVisible();
    }).toPass({ timeout: 20_000 });

    return dialog;
  }

  /**
   * Comprueba que un diálogo de subida de archivos muestra el texto compartido de la zona de carga y el CTA Guardar.
   *
   * @param dialog - Localizador del diálogo visible de Registrar Información.
   */
  protected async expectCargarArchivoDropzone(dialog: Locator): Promise<void> {
    await expect(dialog.getByText(REGISTRO_CARGAR_ARCHIVO_DROPZONE_TEXT)).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Guardar', exact: true })).toBeVisible();
  }

  /**
   * Comprueba el contenido del diálogo de subida de archivos de Registrar Información y luego lo cierra.
   *
   * @param options - Aserción opcional de descarga de plantilla.
   */
  async expectFileUploadDialog(options?: { withTemplate?: boolean }): Promise<void> {
    const dialog = this.page.getByRole('dialog').filter({ hasText: 'Registrar Información' }).last();
    await expect(dialog).toBeVisible({ timeout: 15_000 });
    await this.expectCargarArchivoDropzone(dialog);
    if (options?.withTemplate) {
      await expect(dialog.getByRole('button', { name: 'Descargar plantilla' })).toBeVisible();
    }
    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).not.toBeVisible({ timeout: 10_000 });
    await this.expectNoVisibleModals();
  }

  /**
   * Hace clic en un CTA, abre el diálogo de subida de archivos, valida la zona de carga y Guardar, y lo cierra.
   *
   * @param buttonName - Botón de la barra que abre Registrar Información.
   * @param options - Aserción opcional de descarga de plantilla.
   */
  async expectFileUploadDialogOpensAndCloses(
    buttonName: string | RegExp,
    options?: { withTemplate?: boolean },
  ): Promise<void> {
    await this.openRegistrarInformacionDialog(buttonName);
    await this.expectFileUploadDialog(options);
  }

  /**
   * Cierra los toasts de notificación de Ant Design que pueden interceptar clics en botones del diálogo.
   */
  protected async dismissNotificationToasts(): Promise<void> {
    const alerts = this.page.locator('[role="alert"]');
    for (let attempt = 0; attempt < 5 && (await alerts.count()) > 0; attempt++) {
      const close = alerts.first().getByRole('button', { name: 'Close' });
      if (await close.isVisible()) {
        await close.click();
      }
    }
    await expect(alerts).toHaveCount(0, { timeout: 10_000 });
  }

  /**
   * Descarta de inmediato los popups de Ant Design disparados por interacciones de filtro.
   * Hace clic en cerrar de los toasts de notificación ([role="alert"]) y elimina a la fuerza
   * cualquier elemento restante `.ant-message-notice` / `.ant-notification-notice` del
   * DOM para que las pruebas no esperen el temporizador de cierre automático.
   */
  protected async dismissFilterPopups(): Promise<void> {
    const alert = this.page.locator('[role="alert"]').first();
    const messageNotice = this.page.locator('.ant-message-notice').first();

    await Promise.race([
      alert.waitFor({ state: 'visible', timeout: 5_000 }),
      messageNotice.waitFor({ state: 'attached', timeout: 5_000 }),
    ]).catch(() => {});

    const alerts = this.page.locator('[role="alert"]');
    for (let attempt = 0; attempt < 5 && (await alerts.count()) > 0; attempt++) {
      const close = alerts.first().getByRole('button', { name: 'Close' });
      if (await close.isVisible()) {
        await close.click();
      } else {
        break;
      }
    }

    await this.page.evaluate(() => {
      document
        .querySelectorAll('.ant-message-notice, .ant-notification-notice')
        .forEach((el) => el.remove());
    });
  }

  /**
   * Devuelve un chip de filtro de la barra (.filter-btn) por etiqueta exacta.
   * No coincide con encabezados de columna de la grilla como Estado o Usuario, ni con la pestaña Usuarios NR.
   */
  protected filterChip(label: 'Modo Yo' | 'Estado' | 'Usuarios'): Locator {
    return this.gestorMain()
      .locator('.filter-btn')
      .filter({ hasText: new RegExp(`^${label}$`) });
  }

  /**
   * Devuelve el control Filtros de la barra (.filter-btn), no un título de diálogo ni un encabezado de grilla.
   */
  protected filtrosControl(): Locator {
    return this.gestorMain().locator('.filter-btn').filter({ hasText: /^Filtros$/ });
  }

  /**
   * Comprueba que el control Filtros de la barra es visible en main.
   */
  async expectFiltrosControlVisible(): Promise<void> {
    await expect(this.filtrosControl()).toBeVisible();
  }

  /**
   * Comprueba que el control Filtros de la barra está ausente en main.
   */
  async expectFiltrosControlAbsent(): Promise<void> {
    await expect(this.filtrosControl()).toHaveCount(0);
  }

  /**
   * Comprueba que los chips de barra Modo Yo, Estado y Usuarios están ausentes en main.
   */
  async expectToolbarFilterChipsAbsent(): Promise<void> {
    await expect(this.filterChip('Modo Yo')).toHaveCount(0);
    await expect(this.filterChip('Estado')).toHaveCount(0);
    await expect(this.filterChip('Usuarios')).toHaveCount(0);
  }

  /**
   * Abre el modal Filtros, comprueba Añadir filtro y Limpiar todo, y lo cierra con Close.
   */
  async expectFiltrosModalOpensAndCloses(): Promise<void> {
    await this.expectNoVisibleModals();
    const url = this.page.url();
    await this.filtrosControl().click();
    const dialog = this.page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 15_000 });
    await expect(dialog).toContainText('Filtros');
    await expect(dialog.getByRole('button', { name: /Añadir filtro/i })).toBeVisible();
    await expect(dialog.getByRole('button', { name: /Limpiar todo/i })).toBeVisible();
    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).not.toBeVisible({ timeout: 10_000 });
    await expect(this.page).toHaveURL(url);
    await this.expectNoVisibleModals();
  }

  /**
   * Alterna Modo Yo encendido y luego apagado; espera que no haya navegación fuera de la vista actual.
   * Descarta de forma activa cualquier popup disparado por el filtro en lugar de esperar el cierre automático.
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
   * Abre el diálogo de filtro Estado y lo cierra con Close.
   */
  async expectEstadoFilterDialog(): Promise<void> {
    await this.dismissNotificationToasts();
    await this.filterChip('Estado').click();
    const dialog = this.page.getByRole('dialog');
    await expect(dialog).toContainText('Filtrar por Estado de simulación');
    await this.dismissNotificationToasts();
    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).not.toBeVisible();
  }

  /**
   * Abre el diálogo de filtro Usuarios y lo cierra con Close.
   */
  async expectUsuariosFilterDialog(): Promise<void> {
    await this.dismissNotificationToasts();
    await this.filterChip('Usuarios').click();
    const dialog = this.page.getByRole('dialog');
    await expect(dialog).toContainText('Filtrar por usuarios');
    await this.dismissNotificationToasts();
    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).not.toBeVisible();
  }

  /**
   * Hace clic en un CTA principal, comprueba el contenido del diálogo Registrar Información y lo cierra.
   */
  async expectPrimaryDialogOpensAndCloses(
    buttonName: string | RegExp,
    options?: { stepText?: string | RegExp },
  ): Promise<void> {
    await this.expectNoVisibleModals();
    await this.gestorMain().getByRole('button', { name: buttonName }).click();
    const dialog = this.page.getByRole('dialog').filter({
      hasText: options?.stepText ?? 'Registrar Información',
    }).last();
    await expect(dialog).toBeVisible({ timeout: 15_000 });
    if (options?.stepText) {
      await expect(dialog).toContainText(options.stepText);
    }
    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).not.toBeVisible({ timeout: 10_000 });
    await this.expectNoVisibleModals();
  }

  /**
   * Devuelve el diálogo Registrar Información filtrado por el título del paso activo del asistente.
   */
  protected registroWizardDialog(stepTitle: string | RegExp): Locator {
    return this.page.getByRole('dialog').filter({ hasText: stepTitle }).last();
  }

  /**
   * Construye el matcher de nombre a11y para un control de campo del asistente (maneja el prefijo de asterisco de obligatorio).
   */
  protected wizardFieldNameMatcher(field: RegistroWizardFieldDefinition): string {
    return field.required ? `* ${field.label}` : field.label;
  }

  /**
   * Resuelve el localizador del control interactivo de un campo del asistente dentro del diálogo.
   */
  protected wizardFieldControl(
    dialog: Locator,
    field: RegistroWizardFieldDefinition,
    fieldAssertOptions?: RegistroWizardFieldAssertOptions,
  ): Locator {
    const name = this.wizardFieldNameMatcher(field);
    if (field.kind === 'combobox') {
      const byRole = dialog.getByRole('combobox', { name, exact: true });
      if (fieldAssertOptions?.comboboxFormItemFallback) {
        const byFormItem = dialog
          .locator('.ant-form-item')
          .filter({ hasText: field.label })
          .getByRole('combobox')
          .first();
        return byRole.or(byFormItem);
      }
      return byRole;
    }
    return dialog.getByRole('textbox', { name, exact: true });
  }

  /**
   * Resuelve el localizador de etiqueta de un campo del asistente desde el ancestro form-item de su control.
   */
  protected wizardFieldLabel(
    dialog: Locator,
    field: RegistroWizardFieldDefinition,
    fieldAssertOptions?: RegistroWizardFieldAssertOptions,
  ): Locator {
    return this.wizardFieldControl(dialog, field, fieldAssertOptions)
      .locator('xpath=ancestor::*[contains(@class,"ant-form-item")]')
      .first()
      .locator('.ant-form-item-label');
  }

  /**
   * Recoge etiquetas únicas de opciones de un select de Ant Design, recorriendo la lista virtual cuando existe.
   *
   * @param dropdown - Localizador del desplegable visible de un select de Ant Design.
   */
  async collectWizardSelectOptions(dropdown: Locator): Promise<string[]> {
    const scrollHolder = dropdown.locator('.rc-virtual-list-holder');

    if (!(await scrollHolder.count())) {
      const texts = await dropdown.locator('.ant-select-item-option-content').allTextContents();
      const seen = new Set<string>();
      const unique: string[] = [];
      for (const text of texts) {
        const normalized = text.trim();
        if (!normalized || seen.has(normalized)) {
          continue;
        }
        seen.add(normalized);
        unique.push(normalized);
      }
      return unique;
    }

    return dropdown.evaluate(collectAntSelectDropdownOptionsInBrowser);
  }

  /**
   * Comprueba que las opciones del desplegable coinciden con la lista esperada tras un recorrido de la lista virtual.
   * Las opciones extra de la UI no listadas en el JSON del tenant fallan a menos que se establezca `allowExtra`.
   *
   * @param dropdown - Localizador del desplegable visible de un select de Ant Design.
   * @param expectedOptions - Etiquetas de opción registradas en el JSON del tenant.
   * @param options - Etiqueta de campo opcional y modo subconjunto.
   */
  protected async expectWizardSelectOptionsMatch(
    dropdown: Locator,
    expectedOptions: readonly string[],
    options?: { fieldLabel?: string; allowExtra?: boolean },
  ): Promise<void> {
    const fieldContext = options?.fieldLabel ? ` para "${options.fieldLabel}"` : '';

    await expect(async () => {
      const collected = await this.collectWizardSelectOptions(dropdown);
      const expectedSet = new Set(expectedOptions);
      const collectedSet = new Set(collected);

      const missing = expectedOptions.filter((option) => !collectedSet.has(option));
      const unexpected = options?.allowExtra
        ? []
        : collected.filter((option) => !expectedSet.has(option));

      if (missing.length === 0 && unexpected.length === 0) {
        return;
      }

      const parts: string[] = [];
      if (missing.length > 0) {
        const preview = missing.slice(0, 5).join(', ');
        const suffix = missing.length > 5 ? ` (+${missing.length - 5} más)` : '';
        parts.push(`faltan en la UI${fieldContext}: ${preview}${suffix}`);
      }
      if (unexpected.length > 0) {
        const preview = unexpected.slice(0, 5).join(', ');
        const suffix = unexpected.length > 5 ? ` (+${unexpected.length - 5} más)` : '';
        parts.push(`en la UI pero no en la config${fieldContext}: ${preview}${suffix}`);
      }
      throw new Error(`Las opciones del desplegable no coinciden — ${parts.join('; ')}`);
    }).toPass({ timeout: 45_000 });
  }

  /**
   * Comprueba que un select de Ant Design abierto muestra opciones o el mensaje de estado vacío.
   */
  protected async expectWizardSelectHasOptionsOrEmptyState(dropdown: Locator): Promise<void> {
    const options = dropdown.locator('.ant-select-item-option');
    const emptyState = dropdown.locator('.ant-empty-description');

    if (await options.count()) {
      await expect(options.first()).toBeVisible();
      return;
    }

    await expect(emptyState).toHaveText('No hay datos');
  }

  /**
   * Cierra un desplegable de select de Ant Design abierto sin cerrar el modal del asistente.
   */
  protected async dismissOpenWizardSelectDropdown(
    dialog: Locator,
    strategy: RegistroWizardDismissDropdownStrategy = 'escape',
  ): Promise<void> {
    const openDropdown = this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');
    if (!(await openDropdown.count())) {
      return;
    }

    const dialogHeading = dialog.getByRole('heading', { name: 'Registrar Información' });
    if (strategy === 'heading-click') {
      await dialogHeading.click();
    } else {
      await this.page.keyboard.press('Escape');
      if (await openDropdown.count()) {
        await dialogHeading.click();
      }
    }

    await expect(openDropdown).toHaveCount(0, { timeout: 10_000 });
  }

  /**
   * Comprueba la etiqueta, el tipo de control, el estado habilitado y el comportamiento del desplegable de un campo del asistente.
   */
  protected async expectRegistroWizardField(
    dialog: Locator,
    field: RegistroWizardFieldDefinition,
    dropdownOptions: RegistroWizardDropdownOptionsMap,
    fieldAssertOptions: RegistroWizardFieldAssertOptions = {},
  ): Promise<void> {
    const label = this.wizardFieldLabel(dialog, field, fieldAssertOptions);
    const control = this.wizardFieldControl(dialog, field, fieldAssertOptions);

    if (field.requiresScroll) {
      await control.scrollIntoViewIfNeeded();
    }
    await expect(label).toContainText(field.label);
    await expect(control).toBeVisible();

    if (field.disabled) {
      await expect(control).toBeDisabled();
      if (fieldAssertOptions.assertDisabledComboboxNoDropdown) {
        await control.click({ force: true });
        await expect(
          this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)'),
        ).toHaveCount(0);
      }
      return;
    }

    await expect(control).toBeEnabled();

    if (field.kind === 'datepicker') {
      await expect(control).toHaveAttribute('placeholder', 'Seleccionar fecha');
    }

    if (field.kind === 'combobox') {
      await control.click();
      await expect(control).toHaveAttribute('aria-expanded', 'true');
      const dropdown = this.page
        .locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
        .last();
      await expect(dropdown).toBeVisible();
      const expectedOptions = dropdownOptions[field.label];
      if (expectedOptions === 'conditional') {
        await this.expectWizardSelectHasOptionsOrEmptyState(dropdown);
      } else if (isRegistroWizardDropdownMinimum(expectedOptions)) {
        await this.expectWizardSelectOptionsMatch(dropdown, expectedOptions.minimum, {
          fieldLabel: field.label,
          allowExtra: true,
        });
      } else if (Array.isArray(expectedOptions)) {
        await this.expectWizardSelectOptionsMatch(dropdown, expectedOptions, {
          fieldLabel: field.label,
        });
      } else {
        throw new Error(
          `Faltan las opciones del desplegable en la config del tenant para el combobox "${field.label}"`,
        );
      }
      await this.dismissOpenWizardSelectDropdown(
        dialog,
        fieldAssertOptions.dismissDropdownStrategy ?? 'escape',
      );
      if (fieldAssertOptions.assertFooterAfterCombobox) {
        await expect(dialog).toBeVisible();
        await expect(dialog.getByRole('button', { name: 'Limpiar' })).toBeVisible();
        await expect(dialog.getByRole('button', { name: 'Guardar' })).toBeVisible();
      } else {
        await expect(control).toHaveAttribute('aria-expanded', 'false');
      }
    }
  }

  /**
   * Comprueba que los campos que requieren desplazamiento quedan al alcance dentro del cuerpo del formulario del asistente.
   */
  protected async expectWizardScrollableFieldsReachable(
    dialog: Locator,
    fields: readonly RegistroWizardFieldDefinition[],
    fieldAssertOptions?: RegistroWizardFieldAssertOptions,
  ): Promise<void> {
    const scrollFields = fields.filter((field) => field.requiresScroll);
    if (scrollFields.length === 0) {
      return;
    }

    const lastField = scrollFields[scrollFields.length - 1];
    const lastControl = this.wizardFieldControl(dialog, lastField, fieldAssertOptions);

    await lastControl.scrollIntoViewIfNeeded();
    await expect(lastControl).toBeVisible();
    await expect(this.wizardFieldLabel(dialog, lastField, fieldAssertOptions)).toContainText(
      lastField.label,
    );
  }

  /**
   * Abre un CTA de asistente, valida el contenedor del paso, campos, desplegables y CTAs del pie, y cierra.
   */
  protected async expectRegistroWizardDialogOpensAndCloses(
    options: RegistroWizardDialogOpensAndClosesOptions,
  ): Promise<void> {
    const fieldAssertOptions = options.fieldAssertOptions ?? {};

    await this.expectNoVisibleModals();
    if (fieldAssertOptions.retryOpen) {
      await this.openRegistrarInformacionDialog(options.ctaName);
    } else {
      await this.gestorMain().getByRole('button', { name: options.ctaName }).click();
    }

    const dialog = this.registroWizardDialog(options.stepTitle);
    await expect(dialog).toBeVisible({ timeout: 15_000 });
    await expect(dialog).toContainText('Registrar Información');
    await expect(dialog).toContainText(options.stepTitle);

    if (options.wizardSteps) {
      for (const step of options.wizardSteps) {
        await expect(dialog.getByText(step, { exact: true })).toBeVisible();
      }
    } else if (options.absentWizardSteps) {
      for (const step of options.absentWizardSteps) {
        await expect(dialog.getByText(step, { exact: true })).toHaveCount(0);
      }
    }

    if (options.assertScrollableForm) {
      await this.expectWizardScrollableFieldsReachable(
        dialog,
        options.fields,
        fieldAssertOptions,
      );
    }

    await assertRegistroWizardFieldsMatchConfig(dialog, options.fields, {
      allowExtra: fieldAssertOptions.allowExtraFields,
      extraExpectedLabels: options.extraExpectedLabels,
    });

    for (const field of options.fields) {
      await this.expectRegistroWizardField(
        dialog,
        field,
        options.dropdownOptions,
        fieldAssertOptions,
      );
    }

    if (options.spinbuttonLabels?.length) {
      for (const label of options.spinbuttonLabels) {
        const spinbutton = dialog.getByRole('spinbutton', { name: `* ${label}`, exact: true });
        await expect(spinbutton).toBeVisible();
      }
    }

    if (options.footerVariant === 'misc') {
      await expect(dialog.getByRole('button', { name: 'Cancelar' })).toBeVisible();
      await expect(dialog.getByRole('button', { name: /Siguiente/i })).toHaveCount(0);
    } else {
      await expect(dialog.getByRole('button', { name: 'Cancelar' })).toBeVisible();
      await expect(dialog.getByRole('button', { name: /Siguiente/i })).toBeDisabled();
    }

    await expect(dialog.getByRole('button', { name: 'Limpiar' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Guardar' })).toBeVisible();

    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).not.toBeVisible({ timeout: 10_000 });
    await this.expectNoVisibleModals();
  }

  /**
   * Abre un CTA de asistente, recoge las etiquetas de opciones de combobox de los campos de array JSON, y cierra.
   * Omite campos deshabilitados, mapas `"conditional"` y mapas `{ minimum }`. Lo usa el script de refresco de desplegables.
   *
   * @param options - Nombre del CTA, campos del asistente, mapa actual de desplegables y perfil de aserción de campos.
   */
  async harvestWizardDropdownOptions(options: {
    ctaName: string | RegExp;
    fields: readonly RegistroWizardFieldDefinition[];
    dropdownOptions: RegistroWizardDropdownOptionsMap;
    fieldAssertOptions?: RegistroWizardFieldAssertOptions;
  }): Promise<Record<string, string[]>> {
    const fieldAssertOptions = options.fieldAssertOptions ?? {};
    await this.expectNoVisibleModals();
    const dialog = await this.openRegistrarInformacionDialog(options.ctaName);
    await expect(dialog).toBeVisible({ timeout: 15_000 });

    const harvested: Record<string, string[]> = {};
    for (const field of options.fields) {
      if (field.kind !== 'combobox' || field.disabled) {
        continue;
      }
      const expected = options.dropdownOptions[field.label];
      if (!Array.isArray(expected)) {
        continue;
      }

      const control = this.wizardFieldControl(dialog, field, fieldAssertOptions);
      if (field.requiresScroll) {
        await control.scrollIntoViewIfNeeded();
      }
      await control.click();
      await expect(control).toHaveAttribute('aria-expanded', 'true');
      const dropdown = this.page
        .locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
        .last();
      await expect(dropdown).toBeVisible();
      harvested[field.label] = await this.collectWizardSelectOptions(dropdown);
      await this.dismissOpenWizardSelectDropdown(
        dialog,
        fieldAssertOptions.dismissDropdownStrategy ?? 'escape',
      );
    }

    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).not.toBeVisible({ timeout: 10_000 });
    await this.expectNoVisibleModals();
    return harvested;
  }
}
