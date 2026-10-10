# Zbav se mě!

The Zbav se mě app now lives at the repo root.

This repo stays public for transparency and learning, but it is **not open source for commercial reuse**. Please read [LICENSE.md](./LICENSE.md) before using any part of the code.

## What is here

- `src/` - flat app and shared domains in `<domain>/<kind>/<file>` format, plus routes and assets
- `cli/` - local maintenance and generation scripts
- `test/` - Vitest suites and fixtures
- `e2e/` - Playwright setup and helpers
- `public/` - static assets
- `infra/` - Terraform bootstrap and infrastructure procedures

## Product specification

[`MASTER.md`](./MASTER.md) describes product intent in Czech. It is a draft,
with an actionable review list at the beginning and stable IDs for unresolved
decisions. It does not certify which behavior is currently implemented.
Implementation policy lives in [`AGENTS.md`](./AGENTS.md), including domain and
server boundaries, route/UI conventions, verification, and Git handoff rules.
Area-specific implementation details live in the nearest `README.md`.

## Local development

### Requirements

- [mise](https://mise.jdx.dev/getting-started.html), activated in your shell
- Docker (recommended for local infra)

[`mise.toml`](./mise.toml) pins Node.js (including its bundled npm), argc, GitHub CLI,
Portless, Vercel CLI, Bunny CLI, Terraform, SOPS, age, jq, and Dependency Cruiser for
local development and manual deployment. Application
dependencies stay in `package.json` and `package-lock.json`. The pinned Node.js
24.21.0 distribution includes npm 11.19.0.

### Setup

```bash
mise trust
mise install
npm ci
cp .env.example .env
docker compose up -d
```

Project commands live in [`Argcfile.sh`](./Argcfile.sh). Run `argc --help` to list
them and `argc help <command>` (or `argc <command> --help`) for requirements,
side effects, and accepted arguments. Without shell activation, use `mise exec -- argc <command>` or
`mise exec -- npm ci`. The command runner also enters the mise environment so
Node.js, npm, and local dependency binaries resolve consistently.

### Run locally

```bash
argc proxy
```

Start the app in another terminal:

```bash
argc dev
```

Mailpit is available at <http://127.0.0.1:8025> for local SMTP inbox inspection.

## Project command contract

- **mise** pins the runtime and standalone tools in `mise.toml`.
- **npm** installs dependencies and maintains `package-lock.json`. Use `npm ci` for an exact clean install and `npm install` when changing dependencies.
- **argc** owns project tasks, environment loading, and task composition. `package.json` contains metadata and dependencies, with no task scripts.

All commands run from the repository root. Requirements below assume `mise install`
and `npm ci` have already completed. `argc --help` lists the public commands;
command descriptions and argument definitions are maintained in `Argcfile.sh`.
Task help never executes the task. A bare `--help` or `-h` after the command name
is reserved for task documentation; use `mise exec -- <tool> --help` for the
underlying tool's full option reference.

| Command | Purpose and requirements | Effects |
| --- | --- | --- |
| `dev` | Run Vite; needs local services and the shared HTTPS proxy. | Long-running; registers the app's Portless route and generates development files. |
| `proxy` | Start the shared HTTPS proxy. | Background process; may create local TLS certificates. |
| `build` | Build the application with the configured environment. | Writes build artifacts and may regenerate `src/_route.ts`. |
| `check` | Check manifest ordering, types, style, boundaries, and dependency usage. | Does not fix source files; stops at the first failure. |
| `check-types` | Run TypeScript with `--noEmit`. | May update compiler caches. |
| `check-style` | Check formatting, lint, and imports with `biome ci`. | Does not apply fixes. |
| `check-boundaries` | Enforce domain boundaries with Dependency Cruiser; needs `mise install`. | Reads source using the tool's own TypeScript 6 API; does not install or fix sources. |
| `check-deps` | Report unused dependencies with Knip. | Reports candidates for source review; does not automatically remove them. |
| `fix` | Normalize manifest ordering and apply Biome formatting and safe fixes. | Changes `package.json` and selected source files; defaults to the whole project. |
| `test` | Run Vitest; database and S3 integration tests need Docker. | Unit, integration, and real external service projects; disposable PostgreSQL and SeaweedFS use free ports. Writes coverage. |
| `e2e` | Run Playwright; needs Docker, Chromium, Mailpit, and an available app origin. | Prepares disposable PostgreSQL on a free port, builds and starts the test server, and writes test artifacts. |
| `e2e-install` | Install Chromium and system dependencies; needs network access. | Downloads browser files; Linux system packages may require elevated privileges. |
| `verify` | Run `check`, `test`, `e2e`, then `build` sequentially. | Writes test/build artifacts; stops at the first failure. Does not run `fix` or update dependencies. |
| `deps-update` | Update all dependency versions through Syncpack, then install with npm. | May include major upgrades; changes the manifest, lockfile, and installed dependencies. |
| `seed` | Open the interactive seed CLI; needs the intended database. | Selected operations may reset or change application data. |
| `translations` | Extract translation keys through the TypeScript CLI. | Rewrites generated translation data under `src/database-migration/data`. |
| `env-sync` | Legacy GitHub/Vercel environment sync; needs credentials and `@env/<environment>.json`. | Replaces remote variables and secrets. Retained until Terraform replaces it. |
| `infra-bootstrap-create` | One-time creation of the private S3 state zone; needs Bunny login. | Creates the zone through Bunny CLI, without CDN; Terraform imports it later. |
| `infra-secrets-init` | Enter a Bunny account API key at a hidden prompt and import state storage credentials through Bunny CLI. | Creates an age identity outside Git, public SOPS rules, and encrypted `infra/secrets.enc.json`; changes no cloud resources. |
| `infra-secrets-edit [dev\|uat\|prod]` | Edit shared provider credentials or one environment's application values; needs the age identity. | Initializes missing environment files from the template, then opens SOPS. |
| `infra-bootstrap-init` | Initialize the S3 bootstrap backend; needs encrypted infrastructure credentials and the age identity. | Writes Terraform metadata and installs the pinned provider. |
| `infra-bootstrap-plan` | Preview changes to the private Terraform state zone and shared DNS zone. | Reads infrastructure and state; saves no plan file. |
| `infra-bootstrap-apply` | Import/update the Terraform state zone and manage shared DNS after interactive review. | Writes remote state and applies zone changes; Terraform asks for confirmation. |
| `infra-init <dev\|uat\|prod>` | Initialize an application Terraform workspace after bootstrap. | Connects to S3 and creates/selects the workspace; may write empty remote state. |
| `release <dev\|uat\|prod>` | Build app and migration artifacts using public environment configuration. | Writes `.release/<environment>` and shared build outputs; no cloud operations or dotenv loading. |
| `infra-plan <dev\|uat\|prod>` | Preview application infrastructure and the built release. | Requires `release` and encrypted application values; does not create workspaces or save a plan. |
| `infra-apply <dev\|uat\|prod>` | Apply infrastructure, migrations, assets, and the built release. | Writes remote state, runs the local migrator, and uploads assets through the Bunny provider after Terraform confirmation. |
| `deploy <dev\|uat\|prod>` | Run static checks, all Vitest projects, release build, then Terraform apply. | Uses SOPS application values, disposable test PostgreSQL, and an interactive apply confirmation. |

The [infrastructure guide](./infra/README.md) contains the first bootstrap command
sequence, application credentials, local deployment flow, and fresh-checkout
instructions. Cloud deployment is manual; ordinary checks and builds never
create cloud resources. This repository has no GitHub Actions workflows;
Actions and automatic CodeQL analysis are disabled in the repository settings.
Validation and deployment run locally through `argc`.

Application Terraform workspaces are `dev` (`dev.zbav-se.me`), `uat`
(`uat.zbav-se.me`), and `prod` (`zbav-se.me`, apex). These represent real cloud
environments with separate state. The shared backend bootstrap uses its own
configuration and the `default` workspace. It owns the root Bunny DNS zone;
application workspaces own their DNS records. The infrastructure guide covers
the one-time nameserver change at the registrar.

`check` never runs automatic repairs, tests, or builds. It checks manifest ordering
with `syncpack format --check`; Biome's CI mode validates style without writing
fixes. Use `fix` explicitly and review the resulting diff. `fix` always normalizes
the root manifest, even when paths restrict the subsequent Biome operation.
Syncpack is an internal implementation detail of `check`, `fix`, and `deps-update`.
Style checks use concise diagnostics with file locations, rule names, and messages.
Use `argc check-style --reporter=default` to include source excerpts.

Focused commands forward trailing arguments directly to the tool named in their
help. Do not add an extra `--` separator. Aggregate commands (`check`, `verify`,
and `deps-update`) accept no trailing arguments. For example:

```bash
argc check-style src/user-upload
argc fix src/user-upload
argc test test/@user/resource-bundle
argc e2e --grep registration
argc e2e --headed
argc e2e --ui
```

Playwright has one `mobile` project (Chromium with the iPhone SE device profile).
Headed and UI modes use that same project. The compiled server is an internal
Playwright process defined by [`cli/e2e-server.sh`](./cli/e2e-server.sh), not a
separate public task. Playwright manages its lifetime. The server does not force
an existing Portless route away from another process.

Build, test, seed, and translation commands load the development dotenv cascade
while preserving variables already supplied by the caller. TypeScript CLIs run
through local `tsx` with tsconfig path aliases; `check-types` remains a separate
type check. The shared tsconfig uses React's automatic JSX runtime for TSX CLIs.

For agents: inspect command help before unfamiliar operations. Do not start or
restart `dev` or `proxy` unless requested. Keep `seed`, `deps-update`, and
`env-sync` out of verification; use them only for explicitly requested data,
dependency, or remote environment work. Do not overlap build outputs, E2E runs,
or Vitest coverage runs. The full isolated verification example is below.

Use `npm outdated` to inspect updates and `npm update` for updates within existing
version constraints. `argc deps-update` deliberately refreshes manifest versions
as well, including major versions. It does not run source fixes or verification;
review the manifest and lockfile and then run `argc verify`. npm lifecycle scripts
may run during installation. If installation fails, inspect the changed manifest
before retrying.

## Dev URLs

- App: <https://zbav-se.me.localhost:1355>
- API: <https://api.zbav-se.me.localhost:1355>
- OpenAPI JSON: <https://api.zbav-se.me.localhost:1355/v3/api-docs>

Start the shared HTTPS proxy with `argc proxy`, then run `argc dev`.
Portless uses its default user-level state and serves the `.localhost` URLs on
port `1355`.

## Translation extraction

`argc translations` runs the translation CLI through `tsx`. Babel 8 parses
TypeScript and TSX and extracts the configured JSX attributes, component prop
defaults, function calls, and object method calls. Static template literals and
literal branches are supported; interpolated templates are not translation keys.
`get-tsconfig` resolves `extends`, `include`, `exclude`, and explicit `files`
without loading the TypeScript compiler API.

The extractor preserves existing key escaping and descendant source matching.
It sorts locale output, retains translated values and entries marked `dynamic`,
and removes obsolete static keys. A source parsing error aborts extraction before
any locale files are written.

## Environment Variables

This README is the shared source of truth for environment variable naming and
intent. Cloud application values live in `infra/<environment>.enc.json`; public
settings live in `infra/app.json`, and Terraform supplies generated credentials.
The `@env/*.json` files and `env-sync` command are legacy tooling retained for
later CLI cleanup. Do not use them to configure Terraform-managed projects.

### Infrastructure credentials

Provider credentials (`BUNNYNET_API_KEY`, `NEON_API_KEY`, `VERCEL_API_TOKEN`) and
the S3 backend credentials live in SOPS. Application values live in one encrypted
file per environment. Terraform generates database/S3 credentials and sends the
runtime configuration to Vercel. See [Infrastructure](./infra/README.md).

### Client runtime

| group | VALUE | Required | secret/variable | comment |
| --- | --- | --- | --- | --- |
| assets | `VITE_APP_ASSETS` | yes | variable | Public asset base URL used by the Vite production build for emitted static assets and CDN links. |
| cdn | `VITE_CONTENT_CDN` | yes | variable | Public CDN base URL returned for uploaded content and generated file links. |
| build | `NITRO_PRESET` | default: `vercel` | variable | Optional Nitro deployment preset override for production builds. |

### Server runtime

| group | VALUE | Required | secret/variable | comment |
| --- | --- | --- | --- | --- |
| origins | `VITE_ORIGIN` | yes | variable | Canonical application origin used for CORS, trusted origins, auth redirect URLs, and API calls. |
| auth | `SERVER_BETTER_AUTH_SECRET` | yes | secret | Signing and encryption secret used by Better Auth. |
| auth | `SERVER_HMAC_SECRET` | yes | secret | Secret used for HMAC signing. |
| database | `SERVER_DATABASE_URL` | yes | secret | Postgres connection string used by the server runtime and seed flows. Terraform generates the cloud value; migration programs use the direct endpoint and the app uses the pooled endpoint. |
| e2e | `SERVER_E2E` | optional | variable | Soft gate for e2e DB routing. Set it to `e2e` only in test/dev flows that send `x-e2e-db`. |
| s3 | `SERVER_S3_API` | yes | variable | S3 endpoint: a hostname defaults to HTTPS, or provide a full URL with protocol and optional port (e.g. `http://127.0.0.1:8333`). |
| s3 | `SERVER_S3_BUCKET` | yes | variable | Bucket name used for uploaded content storage. |
| s3 | `SERVER_S3_KEY` | yes | secret | Access key ID for the S3-compatible storage provider. |
| s3 | `SERVER_S3_SECRET` | yes | secret | Secret access key for the S3-compatible storage provider. |
| external-api | `SERVER_GEOAPIFY_TOKEN` | yes | secret | Geoapify API token used for location autocomplete and related geodata lookups. |
| external-api | `SERVER_GITHUB` | yes | secret | GitHub token used by the server-side GitHub integration. |
| mail | `SERVER_SMTP_HOST` | yes | variable | SMTP host used for transactional email delivery. Local development and dev/test flows point to Mailpit; uat and production point to Resend SMTP. |
| mail | `SERVER_SMTP_PORT` | yes | variable | SMTP port used for transactional email delivery. |
| mail | `SERVER_SMTP_USERNAME` | yes | variable | SMTP username used by the transactional mail transport. |
| mail | `SERVER_SMTP_PASSWORD` | yes | secret | SMTP password used by the transactional mail transport. |
| mail | `SERVER_SMTP_FROM` | yes | variable | Sender identity used for transactional emails. |
| seed | `SEED_CORE_CONCURRENCY` | optional | variable | Optional shared concurrency override for seed jobs that use the generic seed concurrency helper. |
| seed | `SEED_INTERACTION_BATCH_SIZE` | default: `25` | variable | Optional batch size override for generated interaction seed writes. |
| seed | `SEED_INTERACTION_CONCURRENCY` | default: `6` | variable | Optional concurrency override for interaction seed generation. |
| seed | `SEED_INTERACTION_SCENARIO_GAP_MINUTES` | default: `3` | variable | Optional override for the time gap between generated interaction scenarios. |
| seed | `SEED_INTERACTION_THUMB_BATCH_SIZE` | default: `100` | variable | Optional batch size override for bulk thumb seed inserts. |
| seed | `SEED_INTERACTION_THUMB_CONCURRENCY` | default: `12` | variable | Optional concurrency override for thumb seed insert workers. |
| seed | `SEED_LOCATION_CYCLES` | default: `0` | variable | Optional override for how many extra location seeding cycles should run. |
| debug | `SERVER_DEBUG_DELAY_MS` | default: `0` | variable | Optional artificial middleware delay in milliseconds for debugging slow flows locally. |
| debug | `NO_COLOR` | optional | variable | Standard terminal flag that disables ANSI colors in CLI and seed output when present. |

## Contributing

Issues and PRs are welcome for bug reports, quality improvements, and architecture feedback.

Before handoff, run the static checks and build:

```bash
argc check
argc build
```

Run relevant tests when behavior changes. `argc verify` is the full gate: static
checks, Vitest, Playwright, and build. It stops at the first failure and runs each
stage sequentially. Use focused commands to filter tests or pass tool options.
Each database test run gets a unique PostgreSQL container and an available
loopback port. Vitest unit and external projects do not start PostgreSQL.
Coverage, E2E reports, and application build outputs are still shared; coordinate
runs that write to the same directories. See [Vitest tests](test/README.md) and
[E2E tests](e2e/README.md) for fixture contracts and focused commands.

To run the full gate alongside an existing development app, use a separate
compiled server and the local Mailpit inbox from `docker compose up -d`:

```bash
PORTLESS=0 PORT=31347 HOST=127.0.0.1 \
VITE_ORIGIN=http://127.0.0.1:31347 NITRO_PRESET=node-server \
MAILPIT_BASE_URL=http://127.0.0.1:8025 \
SERVER_SMTP_HOST=127.0.0.1 SERVER_SMTP_PORT=1025 \
SERVER_SMTP_USERNAME=mailpit SERVER_SMTP_PASSWORD=mailpit \
SERVER_SMTP_FROM='Zbavik <info@zbav-se.me>' \
SERVER_CRON_TOKEN=e2e-cron-token SERVER_MIGRATION_TOKEN=e2e-migration-token \
argc verify
```

The same environment prefix works with `argc e2e --grep <pattern>`. `PORTLESS=0`
bypasses the shared proxy; `PORT`, `HOST`, and `VITE_ORIGIN` must describe the same
available address. E2E builds need the Node server preset, supplied here through
`NITRO_PRESET`. Build outputs are shared with `argc build`, so run these commands
sequentially. Verification does not start or restart the development app or proxy.

Vitest coverage is scoped to server-side `Fx` and DB `Fx` business flows in the owning flat domains. Thin `Fn` wrappers, shared runtime utilities, routes, UI, tools, migrations, and seed scripts are intentionally out of the coverage denominator. Update the coverage scope when adding a covered business domain.

The Playwright e2e flow uses `x-e2e-db` to select the per-test database. That header is ignored unless `SERVER_E2E=e2e` is present.
Playwright runs e2e files in parallel by default. Use `E2E_WORKERS=<count> argc e2e` to tune local or CI concurrency.

The migration chain targets a fresh database and ends at `0056-user-resource-bundle-feature`.
Databases containing removed billing migrations must be recreated before using this revision.
Resource bundles, limits, items, and features remain available to system assignment flows.

## Dependency Hygiene

The application uses Effect 4. Service keys use `Context.Service`, result values
use `Result`, and promise boundaries preserve the original tagged error. Vitest
5 runs the database business-flow suite; type checking uses TypeScript 7 and the
production build uses Vite 8.

The project uses the native compiler from the regular `typescript@7.0.2` package.
`argc check-boundaries` runs `dependency-cruiser@18.5.0` installed by mise.
Dependency Cruiser still needs the TypeScript 6 JavaScript compiler API and does
not install it as a runtime dependency. Its mise entry explicitly installs
`typescript@6.0.3` into the same isolated tool prefix using npm; neither package is
an application dependency. App type checking continues to use local TypeScript 7.
Run `mise install` to prepare tools; boundary checks do not download tools at
runtime.

Better Auth supports the application's Kysely version directly. No dependency
patch or npm lifecycle hook is required.
An npm override keeps `@tanstack/query-core` on the same version as the pinned
`@tanstack/react-query` dependency so router SSR and persistence integrations
share the same `QueryClient` implementation and types.

- Dependency cleanup decisions in this repository are evidence-based from source usage.
- `knip` is treated as a candidate signal, not as the source of truth.
- `dependency-cruiser` rules work on resolved source paths under `src/`, not on import alias strings.
- Declarative resolved-path groups preserve buyer, seller, shared, public, user, and runtime ownership across flat domains. Update the relevant groups in `.dependency-cruiser.cjs` when adding or moving modules.
- Server-crossing import rules keep only approved function/schema surfaces open from the non-server side of the app. Server implementation details live in [`src/SERVER.md`](./src/SERVER.md). Type-only imports and `src/@routes` server glue are exempt.

## MCP

OpenCode configures the Playwright MCP server in [`opencode.json`](./opencode.json).
Shared agent instructions live in [`AGENTS.md`](./AGENTS.md).

Shared MCP server template is in [`mcp.json`](./mcp.json).

- Endpoint: `https://api.zbav-se.me.localhost:1355/api/mcp`
- Auth env var: `MCP_BEARER_TOKEN`
- Transport: `streamable_http`

Note: Codex desktop currently reads MCP server config from `~/.codex/config.toml`.
