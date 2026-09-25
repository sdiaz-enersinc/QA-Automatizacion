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
import type { RegistroCttosCombustibleTenantConfig } from './types/registro-cttos-combustible';
import type { RegistroCttosEnergiaTenantConfig } from './types/registro-cttos-energia';
import type { RegistroEmpresasTenantConfig } from './types/registro-empresas';
import type { RegistroHistorialTenantConfig } from './types/registro-historial';
import type { RegistroInsumosOfertaTenantConfig } from './types/registro-insumos-oferta';
import type { RegistroNavigationTenantConfig } from './types/registro-navigation';
import type { RegistroOtrosContratosTenantConfig } from './types/registro-otros-contratos';
import type { RegistroOtrosDocumentosTenantConfig } from './types/registro-otros-documentos';
import type { RegistroRpmTenantConfig } from './types/registro-rpm';
import type { RegistroSireciTenantConfig } from './types/registro-sireci';
import type { TenantBreadcrumbMatcher } from './types/tenant-breadcrumb';
import type {
  TenantManifest,
  TenantManifestRaw,
  TenantModuleEntry,
  TenantModuleManifestValue,
} from './types/tenant-manifest';

let cachedTenantManifest: TenantManifest | undefined;
let cachedRegistroNavigationConfig: RegistroNavigationTenantConfig | undefined;
let cachedRegistroCttosCombustibleConfig: RegistroCttosCombustibleTenantConfig | undefined;
let cachedRegistroCttosEnergiaConfig: RegistroCttosEnergiaTenantConfig | undefined;
let cachedRegistroOtrosContratosConfig: RegistroOtrosContratosTenantConfig | undefined;
let cachedRegistroInsumosOfertaConfig: RegistroInsumosOfertaTenantConfig | undefined;
let cachedRegistroOtrosDocumentosConfig: RegistroOtrosDocumentosTenantConfig | undefined;
let cachedRegistroHistorialConfig: RegistroHistorialTenantConfig | undefined;
let cachedRegistroSireciConfig: RegistroSireciTenantConfig | undefined;
let cachedRegistroRpmConfig: RegistroRpmTenantConfig | undefined;
let cachedRegistroEmpresasConfig: RegistroEmpresasTenantConfig | undefined;

/**
 * Carga y parsea un JSON de config del tenant desde tests/tenants/<tenant>/.
 *
 * @param relativePath - Ruta relativa al directorio del tenant (p. ej. `tenant.json`).
 */
function loadTenantJsonConfig<T>(relativePath: string): T {
  const configPath = path.join(__dirname, '../../tenants', TEST_TENANT, relativePath);

  if (!fs.existsSync(configPath)) {
    throw new Error(
      `No se encontró la config del tenant: ${configPath} (TEST_TENANT=${TEST_TENANT})`,
    );
  }

  return JSON.parse(fs.readFileSync(configPath, 'utf-8')) as T;
}

/**
 * Normaliza una entrada de módulo de tenant.json a TenantModuleEntry.
 * Atajo booleano: true → habilitado con todas las pestañas; false → deshabilitado.
 *
 * @param value - Valor crudo del módulo en tenant.json.
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
 * Carga y normaliza el manifiesto del tenant desde tenant.json.
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
 * Devuelve el manifiesto del tenant activo (con caché).
 */
export function getTenantManifest(): TenantManifest {
  cachedTenantManifest ??= loadTenantManifest();
  return cachedTenantManifest;
}

/**
 * Indica si un grupo de módulos está habilitado en tenant.json.
 * Si la entrada del grupo no existe, el grupo se trata como habilitado.
 *
 * @param groupId - Clave del grupo padre (p. ej. `registro`).
 */
export function isModuleGroupEnabled(groupId: string): boolean {
  const entry = getTenantManifest().modules[groupId];
  return entry?.enabled ?? true;
}

/**
 * Indica si un módulo está habilitado para el tenant activo.
 * Los submódulos de Registro también exigen modules.registro habilitado en tenant.json.
 *
 * @param moduleId - Id canónico de módulo o clave string de tenant.json.
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
 * Indica si el grupo de módulos Registro está habilitado para el tenant activo.
 */
export function isRegistroEnabled(): boolean {
  return isModuleGroupEnabled(MODULE_GROUP_IDS.registro);
}

/**
 * Indica si un módulo corre en modo full (todas las pestañas/vistas del JSON del módulo).
 *
 * @param moduleId - Id canónico de módulo o clave string de tenant.json.
 */
export function isModuleFull(moduleId: ModuleId | string): boolean {
  if (!isModuleEnabled(moduleId)) {
    return false;
  }

  const entry = getTenantManifest().modules[moduleId];
  return entry?.full === true;
}

/**
 * Convierte slugs de pestaña del tenant en patrones RegExp para aserciones de URL.
 *
 * @param slugs - Mapa nombre de pestaña → patrón de slug de URL, del JSON del módulo.
 */
export function toTabSlugRecord(slugs: Record<string, string>): Record<string, RegExp> {
  return Object.fromEntries(
    Object.entries(slugs).map(([tabName, slug]) => [tabName, new RegExp(slug)]),
  );
}

/**
 * Convierte coincidencias de miga de pan del JSON en string o RegExp para aserciones.
 *
 * @param breadcrumbs - Mapa nombre de pestaña → matcher string o regex, del JSON del módulo.
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
 * Devuelve la config de navegación de Registro del tenant activo (con caché).
 */
export function getRegistroNavigationConfig(): RegistroNavigationTenantConfig {
  cachedRegistroNavigationConfig ??= loadTenantJsonConfig<RegistroNavigationTenantConfig>(
    MODULE_CONFIG_PATHS.registroNavigation,
  );
  return cachedRegistroNavigationConfig;
}

/**
 * Devuelve la config de Registro Contratos combustible del tenant activo (con caché).
 */
export function getRegistroCttosCombustibleConfig(): RegistroCttosCombustibleTenantConfig {
  cachedRegistroCttosCombustibleConfig ??=
    loadTenantJsonConfig<RegistroCttosCombustibleTenantConfig>(
      MODULE_CONFIG_PATHS.registroCttosCombustible,
    );
  return cachedRegistroCttosCombustibleConfig;
}

/**
 * Devuelve la config de Registro Contratos energía del tenant activo (con caché).
 */
export function getRegistroCttosEnergiaConfig(): RegistroCttosEnergiaTenantConfig {
  cachedRegistroCttosEnergiaConfig ??= loadTenantJsonConfig<RegistroCttosEnergiaTenantConfig>(
    MODULE_CONFIG_PATHS.registroCttosEnergia,
  );
  return cachedRegistroCttosEnergiaConfig;
}

/**
 * Devuelve la config de Registro Otros contratos del tenant activo (con caché).
 */
export function getRegistroOtrosContratosConfig(): RegistroOtrosContratosTenantConfig {
  cachedRegistroOtrosContratosConfig ??= loadTenantJsonConfig<RegistroOtrosContratosTenantConfig>(
    MODULE_CONFIG_PATHS.registroOtrosContratos,
  );
  return cachedRegistroOtrosContratosConfig;
}

/**
 * Devuelve la config de Registro Insumos oferta del tenant activo (con caché).
 */
export function getRegistroInsumosOfertaConfig(): RegistroInsumosOfertaTenantConfig {
  cachedRegistroInsumosOfertaConfig ??= loadTenantJsonConfig<RegistroInsumosOfertaTenantConfig>(
    MODULE_CONFIG_PATHS.registroInsumosOferta,
  );
  return cachedRegistroInsumosOfertaConfig;
}

/**
 * Devuelve la config de Registro Otros documentos del tenant activo (con caché).
 */
export function getRegistroOtrosDocumentosConfig(): RegistroOtrosDocumentosTenantConfig {
  cachedRegistroOtrosDocumentosConfig ??= loadTenantJsonConfig<RegistroOtrosDocumentosTenantConfig>(
    MODULE_CONFIG_PATHS.registroOtrosDocumentos,
  );
  return cachedRegistroOtrosDocumentosConfig;
}

/**
 * Devuelve la config de Registro Historial del tenant activo (con caché).
 */
export function getRegistroHistorialConfig(): RegistroHistorialTenantConfig {
  cachedRegistroHistorialConfig ??= loadTenantJsonConfig<RegistroHistorialTenantConfig>(
    MODULE_CONFIG_PATHS.registroHistorial,
  );
  return cachedRegistroHistorialConfig;
}

/**
 * Devuelve la config de Registro Sireci del tenant activo (con caché).
 */
export function getRegistroSireciConfig(): RegistroSireciTenantConfig {
  cachedRegistroSireciConfig ??= loadTenantJsonConfig<RegistroSireciTenantConfig>(
    MODULE_CONFIG_PATHS.registroSireci,
  );
  return cachedRegistroSireciConfig;
}

/**
 * Devuelve la config de Registro RPM del tenant activo (con caché).
 */
export function getRegistroRpmConfig(): RegistroRpmTenantConfig {
  cachedRegistroRpmConfig ??= loadTenantJsonConfig<RegistroRpmTenantConfig>(
    MODULE_CONFIG_PATHS.registroRpm,
  );
  return cachedRegistroRpmConfig;
}

/**
 * Devuelve la config de Registro Empresas del tenant activo (con caché).
 */
export function getRegistroEmpresasConfig(): RegistroEmpresasTenantConfig {
  cachedRegistroEmpresasConfig ??= loadTenantJsonConfig<RegistroEmpresasTenantConfig>(
    MODULE_CONFIG_PATHS.registroEmpresas,
  );
  return cachedRegistroEmpresasConfig;
}

/**
 * Devuelve todos los nombres de pestaña o vista declarados para un módulo registrado.
 *
 * @param moduleId - Id canónico de módulo o clave string de tenant.json.
 */
export function getModuleAllTabNames(moduleId: ModuleId | string): readonly string[] {
  switch (moduleId) {
    case MODULE_IDS.registroCttosCombustible:
      return getRegistroCttosCombustibleConfig().registroCttosCombustibleTabNames;
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
    case MODULE_IDS.registroSireci:
      return getRegistroSireciConfig().registroSireciTabNames;
    case MODULE_IDS.registroRpm:
      return getRegistroRpmConfig().registroRpmTabNames;
    default:
      throw new Error(`ID de módulo desconocido: ${moduleId}`);
  }
}

/**
 * Devuelve la lista parcial de pestañas habilitadas del JSON del módulo (ignora el modo full del tenant).
 *
 * @param moduleId - Id canónico de módulo o clave string de tenant.json.
 */
function getModulePartialEnabledTabNames(moduleId: ModuleId | string): readonly string[] {
  switch (moduleId) {
    case MODULE_IDS.registroCttosCombustible:
      return getRegistroCttosCombustibleConfig().registroCttosCombustibleEnabledTabNames;
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
    case MODULE_IDS.registroSireci:
      return getRegistroSireciConfig().registroSireciEnabledTabNames;
    case MODULE_IDS.registroRpm:
      return getRegistroRpmConfig().registroRpmEnabledTabNames;
    default:
      throw new Error(`ID de módulo desconocido: ${moduleId}`);
  }
}

/**
 * Devuelve los nombres de pestaña o vista habilitados para un módulo registrado.
 * Respeta el modo full de tenant.json: todas las pestañas del módulo cuando full es true.
 *
 * @param moduleId - Id canónico de módulo o clave string de tenant.json.
 */
export function getModuleEnabledTabNames(moduleId: ModuleId | string): readonly string[] {
  if (isModuleFull(moduleId)) {
    return getModuleAllTabNames(moduleId);
  }

  return getModulePartialEnabledTabNames(moduleId);
}

/**
 * Indica si una pestaña está habilitada para un módulo registrado.
 *
 * @param moduleId - Id canónico de módulo o clave string de tenant.json.
 * @param tabName - Etiqueta visible de pestaña según el JSON del módulo.
 */
export function isTabEnabled(moduleId: ModuleId | string, tabName: string): boolean {
  return getModuleEnabledTabNames(moduleId).includes(tabName);
}
