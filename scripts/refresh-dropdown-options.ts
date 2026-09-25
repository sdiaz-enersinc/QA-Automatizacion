/**
 * Maintenance script: recaptures QA combobox options into tenant `*DropdownOptions` JSON maps.
 *
 * Run: `npm run refresh:dropdowns`
 * Env: `REFRESH_DROPDOWNS_WRITE=1` to persist, `REFRESH_DROPDOWNS_MODULE=<moduleId>` to filter.
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
 * Returns whether a JSON value is a string array (harvestable dropdown list).
 *
 * @param value - Raw JSON value from a dropdown-options map.
 */
function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

/**
 * Parses CLI flags for the dropdown refresh script.
 *
 * @param argv - Process arguments (Playwright argv plus optional --write / --module).
 */
function parseCliArgs(argv: readonly string[] = process.argv): { write: boolean; moduleId?: string } {
  const write = argv.includes('--write') || process.env.REFRESH_DROPDOWNS_WRITE === '1';
  const moduleIndex = argv.indexOf('--module');
  const moduleFromArg = moduleIndex >= 0 ? argv[moduleIndex + 1] : undefined;
  const moduleId = process.env.REFRESH_DROPDOWNS_MODULE || moduleFromArg;
  return { write, moduleId };
}

/**
 * Returns the absolute tenant JSON path for a module.
 *
 * @param moduleId - Canonical module id.
 */
function tenantConfigPath(moduleId: ModuleId): string {
  return path.resolve('tests/tenants', TEST_TENANT, MODULE_CONFIG_PATHS[moduleId]);
}

/**
 * Reads a tenant module JSON file as a mutable object.
 *
 * @param configPath - Absolute path to the module JSON.
 */
function readJsonFile(configPath: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(configPath, 'utf-8')) as Record<string, unknown>;
}

/**
 * Writes a tenant JSON file with 2-space indent and a trailing newline.
 *
 * @param configPath - Absolute path to the module JSON.
 * @param data - Updated JSON object.
 */
function writeJsonFile(configPath: string, data: Record<string, unknown>): void {
  fs.writeFileSync(configPath, `${JSON.stringify(data, null, 2)}\n`, 'utf-8');
}

/**
 * Diffs two option lists for console output.
 *
 * @param before - Options currently stored in JSON.
 * @param after - Options collected from QA.
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
 * Harvest job catalog: one entry per `*DropdownOptions` map in tenant JSON.
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
 * Resolves the tab label for a job from a literal or a JSON config key.
 *
 * @param job - Harvest job definition.
 * @param config - Parsed module JSON.
 */
function resolveJobTabName(job: HarvestJob, config: Record<string, unknown>): string | undefined {
  if (job.tabConfigKey) {
    const fromConfig = config[job.tabConfigKey];
    return typeof fromConfig === 'string' ? fromConfig : undefined;
  }
  return job.tabName;
}

/**
 * Returns the field-assert profile used when collecting combobox options.
 *
 * @param profile - energia or combustible harvest profile.
 */
function fieldAssertOptionsFor(
  profile: HarvestJob['fieldProfile'],
): RegistroWizardFieldAssertOptions {
  return profile === 'energia'
    ? REGISTRO_WIZARD_FIELD_ASSERT_ENERGIA
    : REGISTRO_WIZARD_FIELD_ASSERT_COMBUSTIBLE;
}

/**
 * Builds the Gestor de datos path for a harvest job from JSON slugs or a direct path.
 *
 * @param job - Harvest job definition.
 * @param config - Parsed module JSON.
 * @param tabName - Resolved tab label, if the module uses tabs.
 */
function resolveJobPath(
  job: HarvestJob,
  config: Record<string, unknown>,
  tabName: string | undefined,
): string {
  const paths = MODULE_HARVEST_PATHS[job.moduleId];
  if (!paths) {
    throw new Error(`No harvest path mapping for module ${job.moduleId}`);
  }
  if (paths.directPath) {
    return paths.directPath;
  }
  if (!paths.tabSlugsKey || !tabName) {
    throw new Error(`Missing tab slug for ${job.dropdownOptionsKey}`);
  }
  const slugs = config[paths.tabSlugsKey];
  if (!slugs || typeof slugs !== 'object') {
    throw new Error(`Missing ${paths.tabSlugsKey} in ${job.moduleId} config`);
  }
  const slug = (slugs as Record<string, string>)[tabName];
  if (!slug) {
    throw new Error(`No slug for tab "${tabName}" in ${paths.tabSlugsKey}`);
  }
  const normalized = slug.replace(/^\//, '');
  if (normalized.startsWith('gestor-de-datos/')) {
    return `/${normalized}`;
  }
  const prefix = (paths.pathPrefix ?? '/gestor-de-datos/').replace(/\/$/, '');
  return `${prefix}/${normalized}`;
}

/**
 * Deep-links the harvest job view and returns a Registro navigation page.
 *
 * @param page - Authenticated Playwright page.
 * @param job - Harvest job definition.
 * @param config - Parsed module JSON.
 * @param tabName - Resolved tab label, if the module uses tabs.
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
 * Applies harvested option lists onto an existing dropdown-options map.
 * Leaves `"conditional"` values, `{ minimum }` maps, and unknown keys unchanged.
 *
 * @param existing - Dropdown map from tenant JSON.
 * @param harvested - Options collected from QA, keyed by field label.
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
 * Prints a per-field added/removed/unchanged summary.
 *
 * @param job - Harvest job that produced the diffs.
 * @param diffs - Per-field option diffs.
 */
function printDiffs(job: HarvestJob, diffs: FieldDiff[]): void {
  console.log(`\n[${job.moduleId}] ${job.dropdownOptionsKey}`);
  if (diffs.length === 0) {
    console.log('  (no array fields harvested)');
    return;
  }
  for (const diff of diffs) {
    const preview = (items: string[]) => {
      if (items.length === 0) {
        return 'none';
      }
      const head = items.slice(0, 3).join(', ');
      return items.length > 3 ? `${head} (+${items.length - 3} more)` : head;
    };
    console.log(
      `  ${diff.label}: +${diff.added.length} / -${diff.removed.length} / =${diff.unchanged}` +
        ` | added: ${preview(diff.added)} | removed: ${preview(diff.removed)}`,
    );
  }
}

/**
 * Harvests dropdown options for enabled modules of the active tenant and optionally writes JSON.
 *
 * @param page - Authenticated Playwright page on the dashboard.
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
      console.log(`skip ${job.dropdownOptionsKey}: module ${job.moduleId} disabled`);
      continue;
    }

    const configPath = tenantConfigPath(job.moduleId);
    if (!fs.existsSync(configPath)) {
      console.log(`skip ${job.dropdownOptionsKey}: missing ${configPath}`);
      continue;
    }

    const config = pendingWrites.get(configPath) ?? readJsonFile(configPath);
    const tabName = resolveJobTabName(job, config);
    if (job.tabConfigKey && !tabName) {
      console.log(`skip ${job.dropdownOptionsKey}: empty ${job.tabConfigKey}`);
      continue;
    }
    if (tabName && !isTabEnabled(job.moduleId, tabName)) {
      console.log(`skip ${job.dropdownOptionsKey}: tab "${tabName}" disabled`);
      continue;
    }

    const fields = config[job.fieldsKey];
    const dropdownOptions = config[job.dropdownOptionsKey];
    if (!Array.isArray(fields) || !dropdownOptions || typeof dropdownOptions !== 'object') {
      console.log(`skip ${job.dropdownOptionsKey}: missing fields or dropdown map`);
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
      console.log(`wrote ${configPath}`);
    }
  } else {
    console.log(
      '\nDry run: set REFRESH_DROPDOWNS_WRITE=1 to persist JSON updates.',
    );
  }
}
