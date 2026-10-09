/**
 * Script de mantenimiento: recaptura las opciones de combobox de QA en los mapas `*DropdownOptions` del JSON del tenant.
 *
 * Ejecutar: `npm run refresh:dropdowns`
 * Env: `REFRESH_DROPDOWNS_WRITE=1` para persistir, `REFRESH_DROPDOWNS_MODULE=<moduleId>` para filtrar.
 */
import fs from 'fs';
import path from 'path';
import { expect, type Page } from '@playwright/test';
import { TEST_TENANT } from '../tests/support/env';
import { isModuleEnabled, isTabEnabled } from '../tests/support/config/load-tenant-config';
import { MODULE_CONFIG_PATHS, MODULE_IDS, type ModuleId } from '../tests/support/config/module-registry';
import {
  REGISTRO_WIZARD_FIELD_ASSERT_COMBUSTIBLE,
  REGISTRO_WIZARD_FIELD_ASSERT_ENERGIA,
  RegistroNavigationBasePage,
  type RegistroWizardDropdownOptionsMap,
  type RegistroWizardFieldAssertOptions,
  type RegistroWizardFieldDefinition,
} from '../tests/support/pages/registro/registro-navigation-base';

interface HarvestJob {
  moduleId: ModuleId;
  dropdownOptionsKey: string;
  fieldsKey: string;
  tabName?: string;
  tabConfigKey?: string;
  ctaName: string | RegExp;
  fieldProfile: 'energia' | 'combustible';
}

const MODULE_HARVEST_PATHS: Partial<
  Record<ModuleId, { tabSlugsKey?: string; pathPrefix?: string; directPath?: string }>
> = {
  [MODULE_IDS.registroCttosEnergia]: {
    tabSlugsKey: 'registroCttosEnergiaTabSlugs',
    pathPrefix: '/gestor-de-datos/contratos-energia/',
  },
  [MODULE_IDS.registroCttosCombustible]: {
    tabSlugsKey: 'registroCttosCombustibleTabSlugs',
    pathPrefix: '/gestor-de-datos/',
  },
  [MODULE_IDS.registroOtrosContratos]: {
    tabSlugsKey: 'registroOtrosContratosTabSlugs',
    pathPrefix: '/gestor-de-datos/',
  },
  [MODULE_IDS.registroInsumosOferta]: {
    tabSlugsKey: 'registroInsumosOfertaTabSlugs',
    pathPrefix: '/gestor-de-datos/',
  },
  [MODULE_IDS.registroEmpresas]: {
    directPath: '/gestor-de-datos/empresas/empresa',
  },
  [MODULE_IDS.registroRpm]: {
    tabSlugsKey: 'registroRpmTabSlugs',
  },
  [MODULE_IDS.registroSireci]: {
    tabSlugsKey: 'registroSireciTabSlugs',
  },
};

interface FieldDiff {
  label: string;
  added: string[];
  removed: string[];
  unchanged: number;
}

/**
 * Indica si un valor JSON es un arreglo de strings (lista de desplegable recaptable).
 *
 * @param value - Valor JSON crudo de un mapa de opciones de desplegable.
 */
function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

/**
 * Parsea flags de CLI del script de recaptura de desplegables.
 *
 * @param argv - Argumentos del proceso (argv de Playwright más --write / --module opcionales).
 */
function parseCliArgs(argv: readonly string[] = process.argv): { write: boolean; moduleId?: string } {
  const write = argv.includes('--write') || process.env.REFRESH_DROPDOWNS_WRITE === '1';
  const moduleIndex = argv.indexOf('--module');
  const moduleFromArg = moduleIndex >= 0 ? argv[moduleIndex + 1] : undefined;
  const moduleId = process.env.REFRESH_DROPDOWNS_MODULE || moduleFromArg;
  return { write, moduleId };
}

/**
 * Devuelve la ruta absoluta del JSON del tenant para un módulo.
 *
 * @param moduleId - Id canónico de módulo.
 */
function tenantConfigPath(moduleId: ModuleId): string {
  return path.resolve('tests/tenants', TEST_TENANT, MODULE_CONFIG_PATHS[moduleId]);
}

/**
 * Lee el JSON de un módulo del tenant como objeto mutable.
 *
 * @param configPath - Ruta absoluta al JSON del módulo.
 */
function readJsonFile(configPath: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(configPath, 'utf-8')) as Record<string, unknown>;
}

/**
 * Escribe un JSON de tenant con indentación de 2 espacios y un salto de línea final.
 *
 * @param configPath - Ruta absoluta al JSON del módulo.
 * @param data - Objeto JSON actualizado.
 */
function writeJsonFile(configPath: string, data: Record<string, unknown>): void {
  fs.writeFileSync(configPath, `${JSON.stringify(data, null, 2)}\n`, 'utf-8');
}

/**
 * Calcula el diff de dos listas de opciones para la salida de consola.
 *
 * @param before - Opciones actualmente guardadas en el JSON.
 * @param after - Opciones recolectadas desde QA.
 */
function diffOptionLists(
  before: readonly string[],
  after: readonly string[],
): Omit<FieldDiff, 'label'> {
  const beforeSet = new Set(before);
  const afterSet = new Set(after);
  return {
    added: after.filter((option) => !beforeSet.has(option)),
    removed: before.filter((option) => !afterSet.has(option)),
    unchanged: after.filter((option) => beforeSet.has(option)).length,
  };
}

/**
 * Catálogo de trabajos de recaptura: una entrada por mapa `*DropdownOptions` del JSON del tenant.
 */
function harvestJobs(): HarvestJob[] {
  return [
    {
      moduleId: MODULE_IDS.registroCttosEnergia,
      dropdownOptionsKey: 'registroCttosEnergiaLpNuevoContratoFieldsDropdownOptions',
      fieldsKey: 'registroCttosEnergiaLpNuevoContratoFields',
      tabName: 'Largo plazo',
      ctaName: 'Nuevo Contrato',
      fieldProfile: 'energia',
    },
    {
      moduleId: MODULE_IDS.registroCttosEnergia,
      dropdownOptionsKey: 'registroCttosEnergiaUnrNuevoContratoFieldsDropdownOptions',
      fieldsKey: 'registroCttosEnergiaUnrNuevoContratoFields',
      tabName: 'Usuarios NR',
      ctaName: 'Nuevo Contrato',
      fieldProfile: 'energia',
    },
    {
      moduleId: MODULE_IDS.registroCttosEnergia,
      dropdownOptionsKey: 'registroCttosEnergiaDdvNuevoContratoFieldsDropdownOptions',
      fieldsKey: 'registroCttosEnergiaDdvNuevoContratoFields',
      tabName: 'DDV',
      ctaName: 'Nuevo Contrato',
      fieldProfile: 'energia',
    },
    {
      moduleId: MODULE_IDS.registroCttosEnergia,
      dropdownOptionsKey: 'registroCttosEnergiaRmsNuevoContratoFieldsDropdownOptions',
      fieldsKey: 'registroCttosEnergiaRmsNuevoContratoFields',
      tabName: 'RMS',
      ctaName: 'Nuevo Contrato',
      fieldProfile: 'energia',
    },
    {
      moduleId: MODULE_IDS.registroCttosEnergia,
      dropdownOptionsKey: 'registroCttosEnergiaDecNuevoContratoFieldsDropdownOptions',
      fieldsKey: 'registroCttosEnergiaDecNuevoContratoFields',
      tabName: 'DEC',
      ctaName: /Nuevo[n]? contrato/i,
      fieldProfile: 'energia',
    },
    {
      moduleId: MODULE_IDS.registroCttosEnergia,
      dropdownOptionsKey: 'registroCttosEnergiaMiscNuevoRegistroFieldsDropdownOptions',
      fieldsKey: 'registroCttosEnergiaMiscNuevoRegistroFields',
      tabConfigKey: 'registroCttosEnergiaLayoutMiscTab',
      ctaName: 'Nuevo Registro',
      fieldProfile: 'energia',
    },
    {
      moduleId: MODULE_IDS.registroCttosCombustible,
      dropdownOptionsKey: 'registroCttosCombustibleTransporteNuevoRegistroFieldsDropdownOptions',
      fieldsKey: 'registroCttosCombustibleTransporteNuevoRegistroFields',
      tabName: 'Transporte',
      ctaName: 'Nuevo Registro',
      fieldProfile: 'combustible',
    },
    {
      moduleId: MODULE_IDS.registroCttosCombustible,
      dropdownOptionsKey: 'registroCttosCombustibleSuministroNuevoRegistroFieldsDropdownOptions',
      fieldsKey: 'registroCttosCombustibleSuministroNuevoRegistroFields',
      tabName: 'Suministro',
      ctaName: 'Nuevo Registro',
      fieldProfile: 'combustible',
    },
    {
      moduleId: MODULE_IDS.registroOtrosContratos,
      dropdownOptionsKey: 'registroOtrosContratosMiscNuevoRegistroFieldsDropdownOptions',
      fieldsKey: 'registroOtrosContratosMiscNuevoRegistroFields',
      tabName: 'Miscelaneos',
      ctaName: 'Nuevo Registro',
      fieldProfile: 'energia',
    },
    {
      moduleId: MODULE_IDS.registroInsumosOferta,
      dropdownOptionsKey: 'registroInsumosOfertaOefWizardDropdownOptions',
      fieldsKey: 'registroInsumosOfertaOefNuevoRegistroFields',
      tabName: 'OEF Proyectada',
      ctaName: 'Nuevo Registro',
      fieldProfile: 'energia',
    },
    {
      moduleId: MODULE_IDS.registroInsumosOferta,
      dropdownOptionsKey: 'registroInsumosOfertaConceptosOcRegistroDropdownOptions',
      fieldsKey: 'registroInsumosOfertaConceptosOcRegistroFields',
      tabName: 'Conceptos OC',
      ctaName: 'Nuevo Registro',
      fieldProfile: 'combustible',
    },
    {
      moduleId: MODULE_IDS.registroEmpresas,
      dropdownOptionsKey: 'registroEmpresasNuevoClienteProveedorFieldsDropdownOptions',
      fieldsKey: 'registroEmpresasNuevoClienteProveedorFields',
      ctaName: 'Nuevo Cliente/Proveedor',
      fieldProfile: 'combustible',
    },
    {
      moduleId: MODULE_IDS.registroRpm,
      dropdownOptionsKey: 'registroRpmCrearRegistroFieldsDropdownOptions',
      fieldsKey: 'registroRpmCrearRegistroFields',
      tabName: 'XML',
      ctaName: 'Crear Registro',
      fieldProfile: 'combustible',
    },
    {
      moduleId: MODULE_IDS.registroSireci,
      dropdownOptionsKey: 'registroSireciNuevoRegistroFieldsDropdownOptions',
      fieldsKey: 'registroSireciNuevoRegistroComboboxFields',
      tabName: 'Resumen',
      ctaName: 'Nuevo Registro',
      fieldProfile: 'combustible',
    },
  ];
}

/**
 * Resuelve la etiqueta de pestaña de un trabajo a partir de un literal o de una clave JSON.
 *
 * @param job - Definición del trabajo de recaptura.
 * @param config - JSON del módulo ya parseado.
 */
function resolveJobTabName(job: HarvestJob, config: Record<string, unknown>): string | undefined {
  if (job.tabConfigKey) {
    const fromConfig = config[job.tabConfigKey];
    return typeof fromConfig === 'string' ? fromConfig : undefined;
  }
  return job.tabName;
}

/**
 * Devuelve el perfil de aserción de campos usado al recolectar opciones de combobox.
 *
 * @param profile - Perfil de recaptura energia o combustible.
 */
function fieldAssertOptionsFor(
  profile: HarvestJob['fieldProfile'],
): RegistroWizardFieldAssertOptions {
  return profile === 'energia'
    ? REGISTRO_WIZARD_FIELD_ASSERT_ENERGIA
    : REGISTRO_WIZARD_FIELD_ASSERT_COMBUSTIBLE;
}

/**
 * Construye la ruta de Gestor de datos de un trabajo a partir de slugs JSON o una ruta directa.
 *
 * @param job - Definición del trabajo de recaptura.
 * @param config - JSON del módulo ya parseado.
 * @param tabName - Etiqueta de pestaña resuelta, si el módulo usa pestañas.
 */
function resolveJobPath(
  job: HarvestJob,
  config: Record<string, unknown>,
  tabName: string | undefined,
): string {
  const paths = MODULE_HARVEST_PATHS[job.moduleId];
  if (!paths) {
    throw new Error(`No hay mapeo de ruta de recaptura para el módulo ${job.moduleId}`);
  }
  if (paths.directPath) {
    return paths.directPath;
  }
  if (!paths.tabSlugsKey || !tabName) {
    throw new Error(`Falta el slug de pestaña para ${job.dropdownOptionsKey}`);
  }
  const slugs = config[paths.tabSlugsKey];
  if (!slugs || typeof slugs !== 'object') {
    throw new Error(`Falta ${paths.tabSlugsKey} en la config de ${job.moduleId}`);
  }
  const slug = (slugs as Record<string, string>)[tabName];
  if (!slug) {
    throw new Error(`No hay slug para la pestaña "${tabName}" en ${paths.tabSlugsKey}`);
  }
  const normalized = slug.replace(/^\//, '');
  if (normalized.startsWith('gestor-de-datos/')) {
    return `/${normalized}`;
  }
  const prefix = (paths.pathPrefix ?? '/gestor-de-datos/').replace(/\/$/, '');
  return `${prefix}/${normalized}`;
}

/**
 * Abre por deep-link la vista del trabajo de recaptura y devuelve una página de navegación de Registro.
 *
 * @param page - Página autenticada de Playwright.
 * @param job - Definición del trabajo de recaptura.
 * @param config - JSON del módulo ya parseado.
 * @param tabName - Etiqueta de pestaña resuelta, si el módulo usa pestañas.
 */
async function openJobView(
  page: Page,
  job: HarvestJob,
  config: Record<string, unknown>,
  tabName: string | undefined,
): Promise<RegistroNavigationBasePage> {
  const targetPath = resolveJobPath(job, config, tabName);
  await page.goto(targetPath);
  await expect(page).toHaveURL(new RegExp(targetPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), {
    timeout: 15_000,
  });
  if (tabName) {
    const tab = page.getByRole('tab', { name: tabName, exact: true });
    await expect(tab).toBeVisible({ timeout: 15_000 });
    if ((await tab.getAttribute('aria-selected')) !== 'true') {
      await tab.click();
      await expect(tab).toHaveAttribute('aria-selected', 'true');
    }
  }
  return new RegistroNavigationBasePage(page);
}

/**
 * Aplica las listas de opciones recapturadas sobre un mapa de desplegables existente.
 * Deja intactos los valores `"conditional"`, los mapas `{ minimum }` y las claves desconocidas.
 *
 * @param existing - Mapa de desplegables del JSON del tenant.
 * @param harvested - Opciones recolectadas desde QA, indexadas por etiqueta de campo.
 */
function applyHarvestedOptions(
  existing: Record<string, unknown>,
  harvested: Record<string, string[]>,
): { next: Record<string, unknown>; diffs: FieldDiff[] } {
  const next: Record<string, unknown> = { ...existing };
  const diffs: FieldDiff[] = [];

  for (const [label, after] of Object.entries(harvested)) {
    if (!Object.prototype.hasOwnProperty.call(existing, label)) {
      continue;
    }
    const before = existing[label];
    if (!isStringArray(before)) {
      continue;
    }
    const { added, removed, unchanged } = diffOptionLists(before, after);
    diffs.push({ label, added, removed, unchanged });
    next[label] = after;
  }

  return { next, diffs };
}

/**
 * Imprime un resumen por campo de añadidos/eliminados/sin cambio.
 *
 * @param job - Trabajo de recaptura que produjo los diffs.
 * @param diffs - Diffs de opciones por campo.
 */
function printDiffs(job: HarvestJob, diffs: FieldDiff[]): void {
  console.log(`\n[${job.moduleId}] ${job.dropdownOptionsKey}`);
  if (diffs.length === 0) {
    console.log('  (no se recapturaron campos de arreglo)');
    return;
  }
  for (const diff of diffs) {
    /**
     * Resume una lista de opciones para la salida de consola (hasta tres ítems).
     *
     * @param items - Opciones añadidas o eliminadas.
     */
    const preview = (items: string[]) => {
      if (items.length === 0) {
        return 'ninguna';
      }
      const head = items.slice(0, 3).join(', ');
      return items.length > 3 ? `${head} (+${items.length - 3} más)` : head;
    };
    console.log(
      `  ${diff.label}: +${diff.added.length} / -${diff.removed.length} / =${diff.unchanged}` +
        ` | añadidas: ${preview(diff.added)} | eliminadas: ${preview(diff.removed)}`,
    );
  }
}

/**
 * Recaptura opciones de desplegable de los módulos habilitados del tenant activo y, opcionalmente, escribe el JSON.
 *
 * @param page - Página autenticada de Playwright en el tablero.
 */
export async function runRefreshDropdownOptions(page: Page): Promise<void> {
  const { write, moduleId: moduleFilter } = parseCliArgs();

  console.log(
    `refresh-dropdown-options tenant=${TEST_TENANT} mode=${write ? 'write' : 'dry-run'}` +
      (moduleFilter ? ` module=${moduleFilter}` : ''),
  );

  const pendingWrites = new Map<string, Record<string, unknown>>();

  for (const job of harvestJobs()) {
    if (moduleFilter && job.moduleId !== moduleFilter) {
      continue;
    }
    if (!isModuleEnabled(job.moduleId)) {
      console.log(`omitir ${job.dropdownOptionsKey}: módulo ${job.moduleId} desactivado`);
      continue;
    }

    const configPath = tenantConfigPath(job.moduleId);
    if (!fs.existsSync(configPath)) {
      console.log(`omitir ${job.dropdownOptionsKey}: falta ${configPath}`);
      continue;
    }

    const config = pendingWrites.get(configPath) ?? readJsonFile(configPath);
    const tabName = resolveJobTabName(job, config);
    if (job.tabConfigKey && !tabName) {
      console.log(`omitir ${job.dropdownOptionsKey}: ${job.tabConfigKey} vacío`);
      continue;
    }
    if (tabName && !isTabEnabled(job.moduleId, tabName)) {
      console.log(`omitir ${job.dropdownOptionsKey}: pestaña "${tabName}" desactivada`);
      continue;
    }

    const fields = config[job.fieldsKey];
    const dropdownOptions = config[job.dropdownOptionsKey];
    if (!Array.isArray(fields) || !dropdownOptions || typeof dropdownOptions !== 'object') {
      console.log(`omitir ${job.dropdownOptionsKey}: faltan campos o mapa de desplegables`);
      continue;
    }

      const registro = await openJobView(page, job, config, tabName);
    const harvested = await registro.harvestWizardDropdownOptions({
      ctaName: job.ctaName,
      fields: fields as RegistroWizardFieldDefinition[],
      dropdownOptions: dropdownOptions as RegistroWizardDropdownOptionsMap,
      fieldAssertOptions: fieldAssertOptionsFor(job.fieldProfile),
    });

    const { next, diffs } = applyHarvestedOptions(
      dropdownOptions as Record<string, unknown>,
      harvested,
    );
    printDiffs(job, diffs);
    config[job.dropdownOptionsKey] = next;
    pendingWrites.set(configPath, config);
  }

  if (write) {
    for (const [configPath, data] of pendingWrites) {
      writeJsonFile(configPath, data);
      console.log(`escrito ${configPath}`);
    }
  } else {
    console.log(
      '\nSimulación: defina REFRESH_DROPDOWNS_WRITE=1 para persistir actualizaciones de JSON.',
    );
  }
}
