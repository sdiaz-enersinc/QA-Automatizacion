import fs from 'fs';
import path from 'path';
import { TEST_TENANT } from '../env';
import {
  getModuleGroupId,
  MODULE_CONFIG_PATHS,
  MODULE_GROUP_IDS,
  MODULE_IDS,
  type ModuleId,
} from './module-registry';
import type { RegistroCttosEnergiaTenantConfig } from './types/registro-cttos-energia';
import type { RegistroEmpresasTenantConfig } from './types/registro-empresas';
import type { RegistroHistorialTenantConfig } from './types/registro-historial';
import type { RegistroInsumosOfertaTenantConfig } from './types/registro-insumos-oferta';
import type { RegistroNavigationTenantConfig } from './types/registro-navigation';
import type { RegistroOtrosContratosTenantConfig } from './types/registro-otros-contratos';
import type { RegistroOtrosDocumentosTenantConfig } from './types/registro-otros-documentos';
import type { TenantBreadcrumbMatcher } from './types/tenant-breadcrumb';
import type {
  TenantManifest,
  TenantManifestRaw,
  TenantModuleEntry,
  TenantModuleManifestValue,
} from './types/tenant-manifest';

let cachedTenantManifest: TenantManifest | undefined;
let cachedRegistroNavigationConfig: RegistroNavigationTenantConfig | undefined;
let cachedRegistroCttosEnergiaConfig: RegistroCttosEnergiaTenantConfig | undefined;
let cachedRegistroOtrosContratosConfig: RegistroOtrosContratosTenantConfig | undefined;
let cachedRegistroInsumosOfertaConfig: RegistroInsumosOfertaTenantConfig | undefined;
let cachedRegistroOtrosDocumentosConfig: RegistroOtrosDocumentosTenantConfig | undefined;
let cachedRegistroHistorialConfig: RegistroHistorialTenantConfig | undefined;
let cachedRegistroEmpresasConfig: RegistroEmpresasTenantConfig | undefined;

/**
 * Loads and parses a tenant JSON config file from tests/tenants/<tenant>/.
 *
 * @param relativePath - Path relative to the tenant directory (e.g. `tenant.json`).
 */
function loadTenantJsonConfig<T>(relativePath: string): T {
  const configPath = path.join(__dirname, '../../tenants', TEST_TENANT, relativePath);

  if (!fs.existsSync(configPath)) {
    throw new Error(
      `Tenant config not found: ${configPath} (TEST_TENANT=${TEST_TENANT})`,
    );
  }

  return JSON.parse(fs.readFileSync(configPath, 'utf-8')) as T;
}

/**
 * Normalizes a tenant.json module entry into a TenantModuleEntry.
 * Boolean shorthand: true → enabled with all tabs; false → disabled.
 *
 * @param value - Raw module value from tenant.json.
 */
export function normalizeTenantModuleEntry(value: TenantModuleManifestValue): TenantModuleEntry {
  if (typeof value === 'boolean') {
    return value ? { enabled: true, full: true } : { enabled: false };
  }

  return {
    enabled: value.enabled ?? false,
    full: value.full ?? false,
  };
}

/**
 * Loads and normalizes the tenant manifest from tenant.json.
 */
function loadTenantManifest(): TenantManifest {
  const raw = loadTenantJsonConfig<TenantManifestRaw>('tenant.json');
  return {
    modules: Object.fromEntries(
      Object.entries(raw.modules).map(([moduleId, value]) => [
        moduleId,
        normalizeTenantModuleEntry(value),
      ]),
    ),
  };
}

/**
 * Returns the cached tenant manifest for the active tenant.
 */
export function getTenantManifest(): TenantManifest {
  cachedTenantManifest ??= loadTenantManifest();
  return cachedTenantManifest;
}

/**
 * Returns whether a module group is enabled in tenant.json.
 * When the group entry is absent, the group is treated as enabled.
 *
 * @param groupId - Parent group key (e.g. `registro`).
 */
export function isModuleGroupEnabled(groupId: string): boolean {
  const entry = getTenantManifest().modules[groupId];
  return entry?.enabled ?? true;
}

/**
 * Returns whether a module is enabled for the active tenant.
 * Registro submodules also require modules.registro to be enabled in tenant.json.
 *
 * @param moduleId - Canonical module id or a string key from tenant.json.
 */
export function isModuleEnabled(moduleId: ModuleId | string): boolean {
  const groupId = getModuleGroupId(moduleId);
  if (groupId && !isModuleGroupEnabled(groupId)) {
    return false;
  }

  const entry = getTenantManifest().modules[moduleId];
  return entry?.enabled ?? false;
}

/**
 * Returns whether the Registro module group is enabled for the active tenant.
 */
export function isRegistroEnabled(): boolean {
  return isModuleGroupEnabled(MODULE_GROUP_IDS.registro);
}

/**
 * Returns whether a module runs in full mode (all tabs/views from module JSON).
 *
 * @param moduleId - Canonical module id or a string key from tenant.json.
 */
export function isModuleFull(moduleId: ModuleId | string): boolean {
  if (!isModuleEnabled(moduleId)) {
    return false;
  }

  const entry = getTenantManifest().modules[moduleId];
  return entry?.full === true;
}

/**
 * Converts tenant tab slug strings into RegExp patterns for URL assertions.
 *
 * @param slugs - Tab name to URL-slug pattern map from module JSON.
 */
export function toTabSlugRecord(slugs: Record<string, string>): Record<string, RegExp> {
  return Object.fromEntries(
    Object.entries(slugs).map(([tabName, slug]) => [tabName, new RegExp(slug)]),
  );
}

/**
 * Converts JSON breadcrumb matchers into string or RegExp values for assertions.
 *
 * @param breadcrumbs - Tab name to string or regex matcher map from module JSON.
 */
export function toBreadcrumbMatcherRecord(
  breadcrumbs: Record<string, TenantBreadcrumbMatcher>,
): Record<string, string | RegExp> {
  return Object.fromEntries(
    Object.entries(breadcrumbs).map(([tabName, matcher]) => {
      if (typeof matcher === 'string') {
        return [tabName, matcher];
      }
      return [tabName, new RegExp(matcher.regex, matcher.flags)];
    }),
  );
}

/**
 * Returns the cached Registro navigation config for the active tenant.
 */
export function getRegistroNavigationConfig(): RegistroNavigationTenantConfig {
  cachedRegistroNavigationConfig ??= loadTenantJsonConfig<RegistroNavigationTenantConfig>(
    MODULE_CONFIG_PATHS.registroNavigation,
  );
  return cachedRegistroNavigationConfig;
}

/**
 * Returns the cached Registro Contratos energía config for the active tenant.
 */
export function getRegistroCttosEnergiaConfig(): RegistroCttosEnergiaTenantConfig {
  cachedRegistroCttosEnergiaConfig ??= loadTenantJsonConfig<RegistroCttosEnergiaTenantConfig>(
    MODULE_CONFIG_PATHS.registroCttosEnergia,
  );
  return cachedRegistroCttosEnergiaConfig;
}

/**
 * Returns the cached Registro Otros contratos config for the active tenant.
 */
export function getRegistroOtrosContratosConfig(): RegistroOtrosContratosTenantConfig {
  cachedRegistroOtrosContratosConfig ??= loadTenantJsonConfig<RegistroOtrosContratosTenantConfig>(
    MODULE_CONFIG_PATHS.registroOtrosContratos,
  );
  return cachedRegistroOtrosContratosConfig;
}

/**
 * Returns the cached Registro Insumos oferta config for the active tenant.
 */
export function getRegistroInsumosOfertaConfig(): RegistroInsumosOfertaTenantConfig {
  cachedRegistroInsumosOfertaConfig ??= loadTenantJsonConfig<RegistroInsumosOfertaTenantConfig>(
    MODULE_CONFIG_PATHS.registroInsumosOferta,
  );
  return cachedRegistroInsumosOfertaConfig;
}

/**
 * Returns the cached Registro Otros documentos config for the active tenant.
 */
export function getRegistroOtrosDocumentosConfig(): RegistroOtrosDocumentosTenantConfig {
  cachedRegistroOtrosDocumentosConfig ??= loadTenantJsonConfig<RegistroOtrosDocumentosTenantConfig>(
    MODULE_CONFIG_PATHS.registroOtrosDocumentos,
  );
  return cachedRegistroOtrosDocumentosConfig;
}

/**
 * Returns the cached Registro Historial config for the active tenant.
 */
export function getRegistroHistorialConfig(): RegistroHistorialTenantConfig {
  cachedRegistroHistorialConfig ??= loadTenantJsonConfig<RegistroHistorialTenantConfig>(
    MODULE_CONFIG_PATHS.registroHistorial,
  );
  return cachedRegistroHistorialConfig;
}

/**
 * Returns the cached Registro Empresas config for the active tenant.
 */
export function getRegistroEmpresasConfig(): RegistroEmpresasTenantConfig {
  cachedRegistroEmpresasConfig ??= loadTenantJsonConfig<RegistroEmpresasTenantConfig>(
    MODULE_CONFIG_PATHS.registroEmpresas,
  );
  return cachedRegistroEmpresasConfig;
}

/**
 * Returns all tab or view names declared for a registered module.
 *
 * @param moduleId - Canonical module id or a string key from tenant.json.
 */
export function getModuleAllTabNames(moduleId: ModuleId | string): readonly string[] {
  switch (moduleId) {
    case MODULE_IDS.registroCttosEnergia:
      return getRegistroCttosEnergiaConfig().registroCttosEnergiaTabNames;
    case MODULE_IDS.registroOtrosContratos:
      return getRegistroOtrosContratosConfig().registroOtrosContratosTabNames;
    case MODULE_IDS.registroInsumosOferta:
      return getRegistroInsumosOfertaConfig().registroInsumosOfertaTabNames;
    case MODULE_IDS.registroOtrosDocumentos:
      return getRegistroOtrosDocumentosConfig().registroOtrosDocumentosViewNames;
    case MODULE_IDS.registroHistorial:
      return getRegistroHistorialConfig().registroHistorialTabNames;
    default:
      throw new Error(`Unknown module ID: ${moduleId}`);
  }
}

/**
 * Returns the partial enabled tab list from the module JSON (ignores tenant full mode).
 *
 * @param moduleId - Canonical module id or a string key from tenant.json.
 */
function getModulePartialEnabledTabNames(moduleId: ModuleId | string): readonly string[] {
  switch (moduleId) {
    case MODULE_IDS.registroCttosEnergia:
      return getRegistroCttosEnergiaConfig().registroCttosEnergiaEnabledTabNames;
    case MODULE_IDS.registroOtrosContratos:
      return getRegistroOtrosContratosConfig().registroOtrosContratosEnabledTabNames;
    case MODULE_IDS.registroInsumosOferta:
      return getRegistroInsumosOfertaConfig().registroInsumosOfertaEnabledTabNames;
    case MODULE_IDS.registroOtrosDocumentos:
      return getRegistroOtrosDocumentosConfig().registroOtrosDocumentosEnabledViewNames;
    case MODULE_IDS.registroHistorial:
      return getRegistroHistorialConfig().registroHistorialEnabledTabNames;
    default:
      throw new Error(`Unknown module ID: ${moduleId}`);
  }
}

/**
 * Returns enabled tab or view names for a registered module.
 * Honors tenant.json full mode: all module tabs when full is true.
 *
 * @param moduleId - Canonical module id or a string key from tenant.json.
 */
export function getModuleEnabledTabNames(moduleId: ModuleId | string): readonly string[] {
  if (isModuleFull(moduleId)) {
    return getModuleAllTabNames(moduleId);
  }

  return getModulePartialEnabledTabNames(moduleId);
}

/**
 * Returns whether a tab is enabled for a registered module.
 *
 * @param moduleId - Canonical module id or a string key from tenant.json.
 * @param tabName - Visible tab label from module JSON.
 */
export function isTabEnabled(moduleId: ModuleId | string, tabName: string): boolean {
  return getModuleEnabledTabNames(moduleId).includes(tabName);
}
