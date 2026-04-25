# Zbav se mě!

The Zbav se mě app now lives at the repo root.

This repo stays public for transparency and learning, but it is **not open source for commercial reuse**. Please read [LICENSE.md](./LICENSE.md) before using any part of the code.

## What is here

- `src/` - app code, routes, domains, and server runtime
- `@lib/` - shared client/common helpers and UI primitives
- `cli/` - local maintenance and generation scripts
- `test/` - Vitest suites and fixtures
- `e2e/` - Playwright setup and helpers
- `public/` - static assets

## Local development

### Requirements

- Bun `1.3.0+`
- Node.js `22.6.0+`
- Docker (recommended for local infra)

### Setup

```bash
bun install
npm install -g portless
cp .env.example .env.local
```

### Run everything

```bash
portless proxy start --https
bun run dev
```

### Useful root commands

```bash
bun run dev
bun run build
bun run lint
bun run typecheck
bun run test
bun run e2e
bun run sp:format
bun run workflow:test
bun run workflow:check
```

## Dev URLs

- App: <https://zbav-se.me.localhost:1355>
- API: <https://api.zbav-se.me.localhost:1355>
- OpenAPI JSON: <https://api.zbav-se.me.localhost:1355/v3/api-docs>

The app scripts stay as plain `portless ...` commands. Start the shared HTTPS proxy with `portless proxy start --https`, then run `bun run dev`. Portless uses its default user-level state and serves the `.localhost` URLs on port `1355`.

`syncpack` is wired for the root package through `sp:*` scripts. Use `bun run sp:format` to normalize `package.json` ordering and `bun run sp:update` when dependency versions need a bulk refresh.

## Environment Variables

This README is the shared source of truth for environment variable naming and intent in the app.
GitHub Actions environments are the source of truth only for which values are currently configured.
Local sync source files live in `@env/*.json` and can be applied with `bun run env:sync <environment>`.
The shared non-production environment is `uat`, so the canonical sync file is `@env/uat.json`.

### GitHub Actions only

| group | VALUE | Required | secret/variable | comment |
| --- | --- | --- | --- | --- |
| bunny | `BUNNY_HOST` | yes | variable | Bunny SFTP hostname used by deploy workflows for CDN asset sync. |
| bunny | `BUNNY_USER` | yes | variable | Bunny SFTP username used by deploy workflows for CDN asset sync. |
| bunny | `BUNNY_PASSWORD` | yes | secret | Password for Bunny SFTP access used by deploy workflows to upload app assets. |
| bunny | `BUNNY_TOKEN` | optional | secret | Bunny API token used for access to the Bunny HTTP API. It is not the SFTP password. |

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
| auth | `SERVER_JWT_SECRET` | yes | secret | Secret used for JWT signing and verification. |
| database | `SERVER_DATABASE_URL` | yes | secret | Postgres connection string used by the server runtime and seed flows. In GitHub Actions, this value is resolved dynamically from Neon before syncing to Vercel. |
| e2e | `SERVER_E2E` | optional | variable | Soft gate for e2e DB routing. Set it to `e2e` only in test/dev flows that send `x-e2e-db`. |
| s3 | `SERVER_S3_API` | yes | variable | S3-compatible endpoint used for uploads, presigning, and cleanup jobs. |
| s3 | `SERVER_S3_BUCKET` | yes | variable | Bucket name used for uploaded content storage. |
| s3 | `SERVER_S3_KEY` | yes | secret | Access key ID for the S3-compatible storage provider. |
| s3 | `SERVER_S3_SECRET` | yes | secret | Secret access key for the S3-compatible storage provider. |
| external-api | `SERVER_GEOAPIFY_TOKEN` | yes | secret | Geoapify API token used for location autocomplete and related geodata lookups. |
| external-api | `SERVER_GITHUB` | yes | secret | GitHub token used by the server-side GitHub integration. |
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

Before handoff, run at least:

```bash
bun run lint
bun run typecheck
bun run workflow:check
```

`bun run workflow:check` runs the full non-test verification pipeline for the repo: formatting, linting, and TypeScript typecheck.

Vitest coverage is scoped to server-side `Fx` and DB `Fx` business flows. Thin `Fn` wrappers, routes, UI, tools, migrations, and seed scripts are intentionally out of the coverage denominator.

The Playwright e2e flow uses `x-e2e-db` to select the per-test database. That header is ignored unless `SERVER_E2E=e2e` is present.

## Dependency Hygiene

- Dependency cleanup decisions in this repository are evidence-based from source usage.
- `knip` is treated as a candidate signal, not as the source of truth.
- `dependency-cruiser` rules work on resolved source paths under `src/`, not on import alias strings.
- Server-crossing import rules should use resolved `src/...` paths and keep only the approved server surfaces open, such as `server/fn` and `server/schema`, from the non-server side of the app. Type-only imports and `src/@routes` server glue are exempt.

## MCP

Shared MCP server template is in [`mcp.json`](./mcp.json).

- Endpoint: `https://api.zbav-se.me.localhost:1355/api/mcp`
- Auth env var: `MCP_BEARER_TOKEN`
- Transport: `streamable_http`

Note: Codex desktop currently reads MCP server config from `~/.codex/config.toml`.
