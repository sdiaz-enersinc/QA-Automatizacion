import { Locator, Page, expect } from '@playwright/test';
import { getRegistroNavigationConfig } from '../../config/load-tenant-config';
import { collectAntSelectDropdownOptionsInBrowser } from '../../ant-select-collect-options';
import type {
  RegistroWizardFieldDefinition,
  RegistroWizardDropdownOptionsMap,
} from '../../config/types/registro-wizard';
import { assertRegistroWizardFieldsMatchConfig } from '../../registro/form-field-labels';

export type {
  RegistroWizardFieldKind,
  RegistroWizardFieldDefinition,
  RegistroWizardDropdownExpectation,
  RegistroWizardDropdownOptionsMap,
} from '../../config/types/registro-wizard';

const navigationCfg = getRegistroNavigationConfig();

/** Exact submenu labels under Registro in QA (sidebar and dashboard copy). */
export const REGISTRO_NAVIGATION_SUBMENU_LABELS = navigationCfg.registroNavigationSubmenuLabels;

/** How to close an open Ant Design select without dismissing the wizard modal. */
export type RegistroWizardDismissDropdownStrategy = 'heading-click' | 'escape';

/** Per-module overrides for wizard field assertions (combustible vs energía). */
export interface RegistroWizardFieldAssertOptions {
  /** When true, combobox locators fall back to form-item scoped search (energía). */
  comboboxFormItemFallback?: boolean;
  dismissDropdownStrategy?: RegistroWizardDismissDropdownStrategy;
  /** Re-assert dialog footer after each combobox interaction (energía). */
  assertFooterAfterCombobox?: boolean;
  /** Force-click disabled combobox and assert dropdown stays closed (energía). */
  assertDisabledComboboxNoDropdown?: boolean;
  /** When true, only assert config options exist in UI (subset mode). Default: exact set match. */
  allowExtraDropdownOptions?: boolean;
  /** When true, only assert config fields exist in UI (subset). Default: exact field set match. */
  allowExtraFields?: boolean;
}

/** Field assert profile for Contratos combustible wizards. */
export const REGISTRO_WIZARD_FIELD_ASSERT_COMBUSTIBLE: RegistroWizardFieldAssertOptions = {
  dismissDropdownStrategy: 'heading-click',
};

/** Field assert profile for Contratos energía wizards. */
export const REGISTRO_WIZARD_FIELD_ASSERT_ENERGIA: RegistroWizardFieldAssertOptions = {
  comboboxFormItemFallback: true,
  dismissDropdownStrategy: 'escape',
  assertFooterAfterCombobox: true,
  assertDisabledComboboxNoDropdown: true,
};

/** Options for opening a wizard, validating step-1 fields and dropdowns, then closing. */
export interface RegistroWizardDialogOpensAndClosesOptions {
  ctaName: string | RegExp;
  stepTitle: string | RegExp;
  wizardSteps?: readonly string[];
  fields: readonly RegistroWizardFieldDefinition[];
  dropdownOptions: RegistroWizardDropdownOptionsMap;
  assertScrollableForm?: boolean;
  footerVariant?: 'standard' | 'misc';
  /** Wizard step labels that must not appear (MISC energía layout). */
  absentWizardSteps?: readonly string[];
  /** Labels for spinbutton fields not modeled as wizard kinds. */
  extraExpectedLabels?: readonly string[];
  spinbuttonLabels?: readonly string[];
  fieldAssertOptions?: RegistroWizardFieldAssertOptions;
}

/**
 * Reusable navigation for Registro (Gestor de datos) via sidebar or dashboard grid.
 */
export class RegistroNavigationBasePage {
  constructor(protected readonly page: Page) {}

  /**
   * Returns the Registro module card in the authenticated dashboard grid.
   * Scoped to main and disambiguated from other tiles that mention "Registro".
   */
  registroDashboardCard(): Locator {
    return this.page
      .getByRole('main')
      .locator('div')
      .filter({ hasText: 'Registro' })
      .filter({ hasText: 'Cttos energía' })
      .first();
  }

  /** Sidebar region (complementary landmark). */
  protected sidebar(): Locator {
    return this.page.getByRole('complementary').first();
  }

  /**
   * Expands the sidebar when the layout collapsed it after in-app navigation.
   */
  async expandSidebarIfCollapsed(): Promise<void> {
    const unfold = this.page.getByRole('button', { name: 'menu-unfold' });
    if (await unfold.isVisible()) {
      await unfold.click();
      await expect(this.sidebar().getByRole('menuitem', { name: 'Inicio' })).toBeVisible();
    }
  }

  /** Second-level menu under expanded Registro. */
  protected registroSubmenu(): Locator {
    return this.sidebar().getByRole('menu').nth(1);
  }

  /**
   * Expands the Registro section until submodule rows are visible in the sidebar.
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
   * Expands a Registro submodule dropdown (parent row) in the sidebar.
   */
  async expandRegistroSubmodule(submoduleLabel: string): Promise<void> {
    await this.expandRegistroSidebar();
    const submodule = this.registroSubmenu().getByRole('menuitem', { name: submoduleLabel }).first();
    await expect(async () => {
      if ((await submodule.getAttribute('aria-expanded')) !== 'true') {
        await submodule.click();
      }
      await expect(submodule).toHaveAttribute('aria-expanded', 'true');
    }).toPass({ timeout: 10_000 });
  }

  /**
   * Ensures a submodule flyout exposes at least one nested sidebar link.
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
   * Clicks a nested sidebar link inside the expanded Registro submenu.
   */
  protected async clickRegistroSubmenuLink(linkName: string): Promise<void> {
    const link = this.registroSubmenu().getByRole('link', { name: linkName });
    await expect(link).toBeVisible();
    await link.scrollIntoViewIfNeeded();
    await link.click();
  }

  /**
   * Clicks the navigable link inside an expanded Registro submodule dropdown.
   */
  async clickRegistroSubmoduleLink(linkName: string): Promise<void> {
    await this.clickRegistroSubmenuLink(linkName);
  }

  /**
   * Asserts every expected Registro submenu entry is visible with exact labels.
   */
  async expectRegistroSubmenuLabelsVisible(): Promise<void> {
    const submenu = this.registroSubmenu();
    for (const label of REGISTRO_NAVIGATION_SUBMENU_LABELS) {
      await expect(submenu.getByRole('menuitem', { name: label }).first()).toBeVisible();
    }
  }

  /**
   * Hovers the Registro dashboard card to surface submodule navigation affordances.
   */
  async hoverRegistroDashboardCard(): Promise<void> {
    const card = this.page
      .getByRole('main')
      .getByRole('listitem')
      .filter({ hasText: 'Empresas' })
      .locator('xpath=ancestor::div[.//text()[normalize-space(.)="Registro"]][1]');
    await card.hover();
  }

  /** Main content region for Gestor de datos grids (Empresas, Contratos energía, etc.). */
  protected gestorMain(): Locator {
    return this.page.getByRole('main');
  }

  /**
   * Waits until Ant Design modal overlays and dialog nodes are fully dismissed.
   */
  protected async expectNoVisibleModals(): Promise<void> {
    await this.dismissOpenSelectDropdowns();
    await expect(this.page.locator('[role="dialog"]:visible')).toHaveCount(0, { timeout: 10_000 });
    await expect(this.page.locator('.ant-modal-mask:visible')).toHaveCount(0, { timeout: 10_000 });
  }

  /**
   * Closes any open Ant Design select dropdown portals that can swallow toolbar clicks.
   */
  protected async dismissOpenSelectDropdowns(): Promise<void> {
    const openDropdown = this.page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');
    if (await openDropdown.count()) {
      await this.page.keyboard.press('Escape');
      await expect(openDropdown).toHaveCount(0, { timeout: 5_000 });
    }
  }

  /**
   * Resets focus to a neutral toolbar control after closing a modal or calendar interaction.
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
   * Clicks a toolbar CTA and waits for the Registrar Información dialog, retrying flaky opens.
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
   * Closes Ant Design notification toasts that can intercept dialog button clicks.
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
   * Immediately dismisses Ant Design popups triggered by filter interactions.
   * Clicks close on notification toasts ([role="alert"]) and force-removes any
   * remaining `.ant-message-notice` / `.ant-notification-notice` elements from
   * the DOM so tests never wait for the auto-dismiss timer.
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
   * Returns a toolbar filter chip (.filter-btn) by exact label.
   * Does not match grid column headers such as Estado or Usuario, nor the Usuarios NR tab.
   */
  protected filterChip(label: 'Modo Yo' | 'Estado' | 'Usuarios'): Locator {
    return this.gestorMain()
      .locator('.filter-btn')
      .filter({ hasText: new RegExp(`^${label}$`) });
  }

  /**
   * Returns the Filtros toolbar control (.filter-btn), not a dialog title or grid header.
   */
  protected filtrosControl(): Locator {
    return this.gestorMain().locator('.filter-btn').filter({ hasText: /^Filtros$/ });
  }

  /**
   * Asserts the Filtros toolbar control is visible in main.
   */
  async expectFiltrosControlVisible(): Promise<void> {
    await expect(this.filtrosControl()).toBeVisible();
  }

  /**
   * Asserts the Filtros toolbar control is absent from main.
   */
  async expectFiltrosControlAbsent(): Promise<void> {
    await expect(this.filtrosControl()).toHaveCount(0);
  }

  /**
   * Asserts Modo Yo, Estado, and Usuarios toolbar chips are absent from main.
   */
  async expectToolbarFilterChipsAbsent(): Promise<void> {
    await expect(this.filterChip('Modo Yo')).toHaveCount(0);
    await expect(this.filterChip('Estado')).toHaveCount(0);
    await expect(this.filterChip('Usuarios')).toHaveCount(0);
  }

  /**
   * Opens the Filtros modal, asserts Añadir filtro and Limpiar todo, then dismisses with Close.
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
   * Toggles Modo Yo on then off; expects no navigation away from the current view.
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
   * Opens the Estado filter dialog and dismisses it with Close.
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
   * Opens the Usuarios filter dialog and dismisses it with Close.
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
   * Clicks a primary CTA, asserts Registrar Información dialog content, then closes it.
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
   * Returns the Registrar Información dialog filtered by the active wizard step title.
   */
  protected registroWizardDialog(stepTitle: string | RegExp): Locator {
    return this.page.getByRole('dialog').filter({ hasText: stepTitle }).last();
  }

  /**
   * Builds the a11y name matcher for a wizard field control (handles required asterisk prefix).
   */
  protected wizardFieldNameMatcher(field: RegistroWizardFieldDefinition): string {
    return field.required ? `* ${field.label}` : field.label;
  }

  /**
   * Resolves the interactive control locator for a wizard field inside the dialog.
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
   * Resolves the label locator for a wizard field from its control's form-item ancestor.
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
   * Scrolls a virtual Ant Design select once and returns all option labels.
   */
  protected async collectWizardSelectOptions(dropdown: Locator): Promise<string[]> {
    const scrollHolder = dropdown.locator('.rc-virtual-list-holder');

    if (!(await scrollHolder.count())) {
      const texts = await dropdown.locator('.ant-select-item-option-content').allTextContents();
      return texts.map((text) => text.trim()).filter(Boolean);
    }

    return dropdown.evaluate(collectAntSelectDropdownOptionsInBrowser);
  }

  /**
   * Asserts dropdown options match the expected list after one virtual-list pass.
   */
  protected async expectWizardSelectOptionsMatch(
    dropdown: Locator,
    expectedOptions: readonly string[],
    options?: { fieldLabel?: string; allowExtra?: boolean },
  ): Promise<void> {
    const fieldContext = options?.fieldLabel ? ` for "${options.fieldLabel}"` : '';

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
        const suffix = missing.length > 5 ? ` (+${missing.length - 5} more)` : '';
        parts.push(`missing from UI${fieldContext}: ${preview}${suffix}`);
      }
      if (unexpected.length > 0) {
        const preview = unexpected.slice(0, 5).join(', ');
        const suffix = unexpected.length > 5 ? ` (+${unexpected.length - 5} more)` : '';
        parts.push(`in UI but not in config${fieldContext}: ${preview}${suffix}`);
      }
      throw new Error(`Dropdown option mismatch — ${parts.join('; ')}`);
    }).toPass({ timeout: 45_000 });
  }

  /**
   * Asserts an open Ant Design select shows options or the empty-state message.
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
   * Dismisses an open Ant Design select dropdown without closing the wizard modal.
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
   * Asserts a single wizard field label, control type, enabled state, and dropdown behaviour.
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
      } else if (Array.isArray(expectedOptions) && expectedOptions.length > 0) {
        await this.expectWizardSelectOptionsMatch(dropdown, expectedOptions, {
          fieldLabel: field.label,
          allowExtra: fieldAssertOptions.allowExtraDropdownOptions,
        });
      } else if (expectedOptions === undefined) {
        await expect(dropdown.locator('.ant-select-item-option').first()).toBeVisible();
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
   * Asserts scroll-requiring fields become reachable inside the wizard form body.
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
   * Opens a wizard CTA, validates step shell, fields, dropdowns, footer CTAs, then closes.
   */
  protected async expectRegistroWizardDialogOpensAndCloses(
    options: RegistroWizardDialogOpensAndClosesOptions,
  ): Promise<void> {
    const fieldAssertOptions = options.fieldAssertOptions ?? {};

    await this.expectNoVisibleModals();
    await this.gestorMain().getByRole('button', { name: options.ctaName }).click();

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
      await expect(dialog.getByRole('button', { name: 'Cancelar' })).toHaveCount(0);
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
}
