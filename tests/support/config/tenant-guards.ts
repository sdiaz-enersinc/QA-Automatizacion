import { test } from '@playwright/test';
import { isModuleEnabled, isTabEnabled } from './load-tenant-config';
import type { ModuleId } from './module-registry';

/**
 * Omite el test actual si el módulo o su grupo padre está desactivado en tenant.json.
 *
 * @param moduleId - Id canónico de módulo o clave string de tenant.json.
 * @param reason - Mensaje de skip opcional; por defecto avisa que el módulo está desactivado.
 */
export function skipUnlessModuleEnabled(moduleId: ModuleId | string, reason?: string): void {
  if (!isModuleEnabled(moduleId)) {
    test.skip(true, reason ?? `Módulo ${moduleId} desactivado para el tenant`);
  }
}

/**
 * Omite el test actual si la pestaña no está en la lista habilitada del módulo.
 *
 * @param moduleId - Id canónico de módulo o clave string de tenant.json.
 * @param tabName - Etiqueta visible de pestaña según el JSON del módulo.
 * @param reason - Mensaje de skip opcional; por defecto avisa que la pestaña está desactivada.
 */
export function skipUnlessTabEnabled(
  moduleId: ModuleId | string,
  tabName: string,
  reason?: string,
): void {
  if (!isTabEnabled(moduleId, tabName)) {
    test.skip(true, reason ?? `Pestaña ${tabName} desactivada para el módulo ${moduleId}`);
  }
}

/**
 * Omite el test actual si ninguna de las pestañas dadas está habilitada para el módulo.
 *
 * @param moduleId - Id canónico de módulo o clave string de tenant.json.
 * @param tabNames - Etiquetas de pestaña; se omite si todas están desactivadas.
 * @param reason - Mensaje de skip opcional.
 */
export function skipUnlessAnyTabEnabled(
  moduleId: ModuleId | string,
  tabNames: readonly string[],
  reason?: string,
): void {
  const anyEnabled = tabNames.some((tabName) => isTabEnabled(moduleId, tabName));
  if (!anyEnabled) {
    test.skip(
      true,
      reason ?? `Todas las pestañas desactivadas para el módulo ${moduleId}: ${tabNames.join(', ')}`,
    );
  }
}

/**
 * Omite el test actual si alguna de las pestañas dadas está desactivada para el módulo.
 * Usar en pruebas de cruce que requieren todas las pestañas del par.
 *
 * @param moduleId - Id canónico de módulo o clave string de tenant.json.
 * @param tabNames - Etiquetas de pestaña que deben estar todas habilitadas.
 * @param reason - Mensaje de skip opcional.
 */
export function skipUnlessAllTabsEnabled(
  moduleId: ModuleId | string,
  tabNames: readonly string[],
  reason?: string,
): void {
  const disabled = tabNames.filter((tabName) => !isTabEnabled(moduleId, tabName));
  if (disabled.length > 0) {
    test.skip(
      true,
      reason ?? `Pestañas desactivadas para el módulo ${moduleId}: ${disabled.join(', ')}`,
    );
  }
}

/**
 * Ejecuta el callback solo si la pestaña está habilitada para el módulo; no-op si está desactivada.
 *
 * @param moduleId - Id canónico de módulo o clave string de tenant.json.
 * @param tabName - Etiqueta visible de pestaña según el JSON del módulo.
 * @param fn - Trabajo a ejecutar cuando la pestaña está habilitada.
 * @param stepName - Título opcional del paso de Playwright.
 */
export async function whenTabEnabled(
  moduleId: ModuleId | string,
  tabName: string,
  fn: () => void | Promise<void>,
  stepName?: string,
): Promise<void> {
  if (!isTabEnabled(moduleId, tabName)) {
    return;
  }

  if (stepName) {
    await test.step(stepName, fn);
  } else {
    await fn();
  }
}
