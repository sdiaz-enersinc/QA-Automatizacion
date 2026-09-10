# New — import progresivo de TestingWithByPass

Esta carpeta es una copia **parcial** de `TestingWithByPass`. El objetivo es traer solo los archivos y funciones que realmente se usan, rebanada a rebanada, y dejar el proyecto original como fuente de verdad hasta que cada rebanada pase en `New`.

## Cómo se copia

1. Elegir **un spec** (o, al inicio, solo el esqueleto del proyecto).
2. Copiar ese archivo y todo lo que importa, de forma transitiva.
3. Ejecutar **solo ese spec**.
4. Repetir. No copiar carpetas enteras “porque van juntas”.

## Paso 0 — esqueleto Playwright (hecho)

Este paso deja `New` como proyecto Playwright instalable, **sin tests todavía**.

### Qué se copió o adaptó

| Archivo | Qué cambió respecto a `TestingWithByPass` |
| --- | --- |
| `package.json` | Mismo runtime (`@playwright/test`, `dotenv`). Sin script de harvest. |
| `package-lock.json` | Se regenera con `npm install` a partir del `package.json` de este paso. |
| `.gitignore` | Igual: ignora `.env`, `node_modules`, reportes de Playwright. |
| `playwright.config.ts` | Misma `baseURL`, token `QA-Bypass-Token`, filtro por `TEST_TENANT` y proyectos `chromium` / `firefox` / `webkit` (más variantes `-unauth`). El match de auth no autenticado apunta a `tenants/<tenant>/auth/pruebas/`. |

### Qué se dejó fuera a propósito

- Reporter CSV, teardown CSV y `tests/reporters/`.
- `playwright.harvest.config.ts` y `scripts/` de harvest.
- `tests/support/auth.ts` (storageState; el login de esta suite es UI + contexto compartido).
- Registro, `load-tenant-config`, JSON de tenant y el resto de specs de auth.
- `.env` no forma parte del import: ya debe existir en local y **no** se versiona.

### Variables de entorno

Define estas claves en `.env` (valores reales solo en local):

| Variable | Uso |
| --- | --- |
| `BASE_URL` | URL base de QA (`use.baseURL`). |
| `TOKEN_BYPASS` | Cabecera `QA-Bypass-Token`. |
| `TEST_TENANT` | Tenant activo; por defecto `emug` si falta. Filtra `tests/tenants/<tenant>/**/*.spec.ts`. |
| `VALID_EMAIL` / `VALID_PASSWORD` | Login válido (paso 1 en adelante). |
| `INVALID_EMAIL` / `INVALID_PASSWORD` | Specs de auth negativa (paso 1 en adelante). |

### Cómo instalar

Desde esta carpeta (`New`):

```bash
npm install
npx playwright install
```

Un spec de login: `npx playwright test --project=chromium-unauth`.

## Paso 0.5 — arquitectura de carpetas (hecho)

Carpetas por tenant y módulo. El código de login vive en `support/`; los specs, bajo `tenants/<id>/…/pruebas/`.

Convención: **`support/` es código compartido**; **`tenants/` es datos JSON y specs**.

```text
tests/
├── support/                          # código compartido (login kernel)
│   ├── config/                       # loader, registry, guards, types/
│   ├── pages/                        # POM de login aquí; registro/ y despacho/ por módulo
│   │   ├── registro/
│   │   └── despacho/
│   └── registro/                     # helpers de DOM (labels, headers de tabla)
└── tenants/
    ├── emug/
    │   ├── tenant.json               # manifest del tenant (paso 2)
    │   ├── auth/pruebas/
    │   │   ├── email-auth/
    │   │   └── password-auth/
    │   └── registro/
    │       ├── config/               # JSON de columnas, tabs, wizard
    │       └── pruebas/              # specs Playwright
    ├── gecg/                         # misma forma que emug
    └── tbsg/                         # misma forma que emug
```

Un módulo de producto nuevo (por ejemplo MDM) suma `support/pages/mdm/` y `tenants/<tenant>/mdm/{config,pruebas}/`.

## Paso 1 — kernel de login (hecho)

Un spec no autenticado prueba el stack: env, POM de login, fixtures y `globalSetup` (solo valida que exista `tests/tenants/<tenant>`).

| Destino en `New` | Origen |
| --- | --- |
| `tests/support/env.ts` | `tests/support/env.ts` |
| `tests/support/urls.ts` | `tests/tenants/emug/support/urls.ts` (compartido) |
| `tests/support/timeouts.ts` | `tests/tenants/emug/support/timeouts.ts` (compartido) |
| `tests/support/pages/EmailStepPage.ts` | `tests/tenants/emug/support/pages/EmailStepPage.ts` |
| `tests/support/pages/PasswordStepPage.ts` | idem |
| `tests/support/pages/DashboardPage.ts` | idem |
| `tests/support/ui-login.ts` | `tests/support/ui-login.ts` (imports estáticos; ya no carga POM por tenant) |
| `tests/support/shared-session.ts` | `tests/support/shared-session.ts` |
| `tests/support/fixtures.ts` | `tests/tenants/emug/support/fixtures.ts` |
| `tests/global-setup.ts` | igual, **sin** `ensureCanonicalCatalog` |
| `tests/tenants/emug/auth/pruebas/password-auth/successful-password-login.spec.ts` | spec de login válido |

## Paso 2 — kernel de config (hecho)

Loader slim: solo el manifest (`tenant.json`). Sin JSON de módulos ni getters de tabs (paso 3).

| Destino en `New` | Origen / acción |
| --- | --- |
| `tests/support/config/types/tenant-manifest.ts` | `tests/config/types/tenant-manifest.ts` |
| `tests/support/config/module-registry.ts` | `tests/config/module-registry.ts`; `MODULE_CONFIG_PATHS` apunta a `registro/config/*.json` |
| `tests/support/config/load-tenant-config.ts` | Solo manifest: `getTenantManifest`, `isModuleEnabled`, `isModuleFull`, etc. |
| `tests/support/config/tenant-guards.ts` | Solo `skipUnlessModuleEnabled` |
| `tests/tenants/emug/tenant.json` | `tests/config/tenants/emug/tenant.json` |

`global-setup.ts` exige `tenant.json` y llama `getTenantManifest()`. `TEST_TENANT` en `env.ts` default `emug`.

## Paso 3 — navegación Registro + seed (hecho)

Seed autenticado: dashboard → sidebar Cttos energía → shell del gestor. POM slim (solo sidebar); JSON de energía copiado completo.

| Destino en `New` | Origen / acción |
| --- | --- |
| `tests/tenants/emug/registro/config/navigation.json` | `tests/config/tenants/emug/registro/navigation.json` |
| `tests/tenants/emug/registro/config/cttos-energia.json` | `tests/config/tenants/emug/registro/cttos-energia.json` (completo) |
| `tests/support/config/types/registro-navigation.ts` | igual |
| `tests/support/config/types/registro-cttos-energia.ts` | slim: tabs + slugs |
| `tests/support/config/load-tenant-config.ts` | getters de navegación/energía, `isTabEnabled` (solo `registroCttosEnergia`) |
| `tests/support/config/tenant-guards.ts` | + `skipUnlessTabEnabled` |
| `tests/support/pages/registro/registro-navigation-base.ts` | sidebar only |
| `tests/support/pages/registro/cttos-energia.ts` | cadena del seed |
| `tests/tenants/emug/registro/pruebas/cttos-energia/seed-cttos-energia.spec.ts` | seed autenticado |

## Paso 4 — resto de specs de Contratos energía (hecho)

Las 14 specs restantes de energía. POM y helpers completos; el JSON no se recopia.

| Destino en `New` | Origen / acción |
| --- | --- |
| `tests/support/config/types/registro-wizard.ts` | igual |
| `tests/support/config/types/tenant-breadcrumb.ts` | igual |
| `tests/support/config/types/registro-cttos-energia.ts` | tipo completo (ya no slim) |
| `tests/support/config/load-tenant-config.ts` | + `toBreadcrumbMatcherRecord` |
| `tests/support/config/tenant-guards.ts` | + `skipUnlessAnyTabEnabled`, `skipUnlessAllTabsEnabled`, `whenTabEnabled` |
| `tests/support/registro/table-column-headers.ts` | igual |
| `tests/support/registro/form-field-labels.ts` | import hacia `support/config/types` |
| `tests/support/ant-select-collect-options.ts` | igual |
| `tests/support/pages/registro/registro-navigation-base.ts` | POM completo (wizard, toolbar, hover) |
| `tests/support/pages/registro/cttos-energia.ts` | POM completo |
| `tests/tenants/emug/registro/pruebas/cttos-energia/*.spec.ts` | 14 specs + seed |

## Paso 5 — resto de emug enabled + auth (hecho)

Auth restante, navigation y módulos Registro enabled. Sin combustible, RPM ni SIRECI.

| Destino en `New` | Origen / acción |
| --- | --- |
| `tests/tenants/emug/auth/pruebas/email-auth/` | 2 specs (imports a `support/urls` y `support/env`) |
| `tests/tenants/emug/auth/pruebas/password-auth/` | 3 specs extra + login ya existente |
| `tests/tenants/emug/registro/pruebas/navigation/` | 4 specs |
| `tests/tenants/emug/registro/pruebas/empresas/` | 5 specs |
| `tests/tenants/emug/registro/pruebas/otros-contratos/` | 5 specs |
| `tests/tenants/emug/registro/pruebas/planta-consumos/` | 12 specs |
| `tests/tenants/emug/registro/pruebas/insumos-oferta/` | 2 specs (POM de planta) |
| `tests/tenants/emug/registro/pruebas/otros-documentos/` | 8 specs |
| `tests/tenants/emug/registro/pruebas/historial/` | 10 specs |
| `tests/tenants/emug/registro/config/{empresas,otros-contratos,planta-consumos,otros-documentos,historial}.json` | JSON de módulo |
| `tests/support/config/types/registro-{empresas,otros-contratos,planta-consumos,otros-documentos,historial}.ts` | tipos |
| `tests/support/pages/registro/{empresas,otros-contratos,planta-consumos,otros-documentos,historial}.ts` | POM |
| `tests/support/config/load-tenant-config.ts` | getters + switch de tabs (sin combustible/RPM/SIRECI) |

### Qué se dejó fuera a propósito

- `cttos-combustible`, `RPM`, `sireci` (disabled en `tenant.json`).
- Despacho, tenants `tbsg` / `gecg`, harvest, reporters CSV.

### Verificación (chromium)

| Grupo | Resultado |
| --- | --- |
| `chromium-unauth` (6 auth) | 5 passed; 1 failed (QA) |
| navigation + empresas | 8 passed; 1 failed (QA vs JSON) |
| otros-contratos + planta-consumos + insumos-oferta | 14 passed; 5 skipped (tabs locked en JSON) |
| otros-documentos + historial | 14 passed; 4 skipped (Contadores / hover placeholder) |

Desajustes QA vs harvest (no se recorta JSON para “arreglarlos”):

- `layout-a-empresas-grid`: el diálogo Nuevo Cliente/Proveedor muestra **Sectores Operativos** en UI y no está en `empresas.json`.
- `whitespace-only-password`: QA navega a `/privacy-policy` en lugar del alert «Ocurrió un error inesperado…».
- Energía (paso 4): `layout-c-dec-grid` dropdown `Estado` vs harvest.

## Paso 6 — agentes Playwright (hecho)

Definiciones de agente y MCP `playwright-test` para planner / generator / healer. Abrir la carpeta `New` como raíz del workspace para que Cursor cargue `.cursor/`.

| Destino en `New` | Origen |
| --- | --- |
| `.cursor/mcp.json` | servidor MCP `npx playwright run-test-mcp-server` |
| `.cursor/commands/playwright-test-planner.agent.md` | igual |
| `.cursor/commands/playwright-test-generator.agent.md` | igual |
| `.cursor/commands/playwright-test-healer.agent.md` | igual |

Los planes generados van a `specs/` (ya en `.gitignore`). Los seeds de módulo ya existen bajo `tests/tenants/<tenant>/…/seed-*.spec.ts`.

## Paso 7 — tenant gecg (hecho)

Auth + Registro de gecg. Support compartido; JSON y specs bajo `tests/tenants/gecg/`. Combustible, RPM y SIRECI entran a `support/` porque emug no los trajo.

Para correr gecg: `TEST_TENANT=gecg` y credenciales gecg en `.env`. Si `VALID_PASSWORD` contiene apóstrofos, usa comillas dobles (`VALID_PASSWORD="..."`); las comillas simples de dotenv cortan el valor.

| Destino en `New` | Origen / acción |
| --- | --- |
| `tests/tenants/gecg/tenant.json` | `tests/config/tenants/gecg/tenant.json` |
| `tests/tenants/gecg/registro/config/navigation.json` | submenu gecg + schema New (enabled/locked/legacy/preview) |
| `tests/tenants/gecg/auth/pruebas/` | 6 specs (imports a `support/`) |
| `tests/tenants/gecg/registro/config/{empresas,cttos-energia,historial,cttos-combustible,rpm,sireci}.json` | JSON del original |
| `tests/tenants/gecg/registro/pruebas/{empresas,historial,cttos-energia,cttos-combustible,rpm,sireci}/` | 37 specs Registro (seed de energía restaurado con tab `Contratos LP`) |
| `tests/support/config/types/registro-{cttos-combustible,rpm,sireci}.ts` | tipos |
| `tests/support/config/load-tenant-config.ts` | getters + switch de tabs combustible/RPM/SIRECI |
| `tests/support/pages/registro/{cttos-combustible,rpm,sireci}.ts` | POM (imports a `support/config`) |
| `tests/support/pages/registro/cttos-energia.ts` | `waitForDecTabToolbarReady` usa el label DEC del JSON del tenant |

### Qué se dejó fuera a propósito

- `tests/tenants/gecg/support/` (fixtures, login POM, Despacho).
- Planta y consumos / Otros documentos (disabled y sin specs).
- Harvest, `_archive/gecg-harvest-data.json`, reporters CSV.
- Specs de `navigation/` (gecg no los tenía).
- JSON de combustible/RPM/SIRECI en **emug** (loader lazy).

`layout-d-respaldos-grid` usa el tab locked `Contratos Respaldos` → skip.
`layout-resumen-tab` permanece `test.fixme` como en el original.

Verificación Chromium (`TEST_TENANT=gecg`): el loader lista 8 módulos enabled; `--list` carga 6 specs unauth + 39 casos Registro. El correo autorizado y los casos negativos de contraseña vacía/inválida pasan. El login válido y el caso de solo espacios fallan hoy en QA (el formulario no entra al dashboard; espacios navega a `/privacy-policy`), así que los seeds autenticados no se pudieron ejercer hasta actualizar la contraseña gecg.

## Siguientes pasos (aún no copiados)

1. Tenant `tbsg` y/o reporters CSV.
2. Módulos Registro disabled, si se habilitan en `tenant.json`.
