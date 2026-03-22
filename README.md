# Zbav se mě!

A modern C2C marketplace monorepo.

This repo stays public for transparency and learning, but it is **not open source for commercial reuse**. Please read [LICENSE.md](./LICENSE.md) before using any part of the code.

## What is here

- `apps/app` - unified frontend app (public site, auth, buyer + seller flows)
- `apps/server` - API backend
- `packages/@zbav-se.me/*` - shared domain/UI/SDK packages
- `packages/@use-pico/*` - internal framework utilities

## Local development

### Requirements

- Bun `1.3.0+`
- Node.js `22.6.0+` (needed for Syncpack/CI tooling)
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
bun run preview
bun run sdk
bun run lint
bun run typecheck
bun run test
bun run workflow:check
```

`bun run preview` is managed by Turbo. The frontend app and server build their production preview outputs first and then start from those built outputs.

`bun run test` runs the existing Vitest suites.

The local Postgres Docker image is tagged as `zbav-se.me:postgres` so Docker Compose and test setup reuse the same build cache and image name.
The server test bootstrap also reuses a compatible running test Postgres container when available and only runs the initial schema migration when the template database has not been prepared yet.
Root `bun run test` delegates the server suite through Turbo, but the actual `@zbav-se.me/server` test command still runs with `apps/server` as its working directory. The server test bootstrap therefore resolves the Docker build context from the test file location instead of assuming the current working directory is the repo root.

## Dev URLs

- App: <https://zbav-se.me.localhost:1355>
- API: <https://api.zbav-se.me.localhost:1355>
- OpenAPI JSON: <https://api.zbav-se.me.localhost:1355/v3/api-docs>

The app and server scripts stay as plain `portless ...` commands. In the simplified non-root setup, start the shared HTTPS proxy with `portless proxy start --https`, then run `bun run dev`. Portless uses its default user-level state and serves the `.localhost` URLs on port `1355`.

## Environment Variables

This README is the shared source of truth for environment variable naming and intent in `apps/app` and `apps/server`.
GitHub Actions environments are the source of truth only for which values are currently configured.

### apps/app

| group | VALUE | secret/variable | comment |
| --- | --- | --- | --- |
| origins | `VITE_SERVER_API` | variable | Public API base URL used by the frontend auth and API clients. |
| assets | `VITE_APP_ASSETS` | variable | Public asset base URL used by the Vite production build for emitted static assets. |
| build | `NITRO_PRESET` | variable | Optional Nitro deployment preset override for production builds. Falls back to `vercel` when not set. |

### apps/server

| group | VALUE | secret/variable | comment |
| --- | --- | --- | --- |
| origins | `VITE_ORIGIN` | variable | Canonical frontend origin used for CORS, trusted origins, and auth redirect URLs. |
| origins | `VITE_SERVER_API` | variable | Canonical API base URL used by auth configuration and generated OpenAPI metadata. |
| auth | `SERVER_BETTER_AUTH_SECRET` | secret | Signing and encryption secret used by Better Auth. |
| auth | `SERVER_JWT_SECRET` | secret | Secret used for JWT signing and verification. |
| database | `SERVER_DATABASE_URL` | secret | Postgres connection string used by the server runtime and seed flows. |
| s3 | `SERVER_S3_API` | variable | S3-compatible endpoint used for uploads, presigning, and cleanup jobs. |
| s3 | `SERVER_S3_BUCKET` | variable | Bucket name used for uploaded content storage. |
| s3 | `SERVER_S3_KEY` | secret | Access key ID for the S3-compatible storage provider. |
| s3 | `SERVER_S3_SECRET` | secret | Secret access key for the S3-compatible storage provider. |
| cdn | `SERVER_CONTENT_CDN` | variable | Public CDN base URL returned for uploaded content and generated file links. |
| external-api | `SERVER_GEOAPIFY_TOKEN` | secret | Geoapify API token used for location autocomplete and related geodata lookups. |
| external-api | `SERVER_GITHUB` | secret | GitHub token used by the server-side GitHub integration. |
| seed | `SEED_CORE_CONCURRENCY` | variable | Optional shared concurrency override for seed jobs that use the generic seed concurrency helper. |
| seed | `SEED_INTERACTION_BATCH_SIZE` | variable | Optional batch size override for generated interaction seed writes. |
| seed | `SEED_INTERACTION_CONCURRENCY` | variable | Optional concurrency override for interaction seed generation. |
| seed | `SEED_INTERACTION_SCENARIO_GAP_MINUTES` | variable | Optional override for the time gap between generated interaction scenarios. |
| seed | `SEED_INTERACTION_THUMB_BATCH_SIZE` | variable | Optional batch size override for bulk thumb seed inserts. |
| seed | `SEED_INTERACTION_THUMB_CONCURRENCY` | variable | Optional concurrency override for thumb seed insert workers. |
| seed | `SEED_LOCATION_CYCLES` | variable | Optional override for how many extra location seeding cycles should run. |
| debug | `SERVER_DEBUG_DELAY_MS` | variable | Optional artificial middleware delay in milliseconds for debugging slow flows locally. |
| debug | `NO_COLOR` | variable | Standard terminal flag that disables ANSI colors in CLI and seed output. |

## Architecture at a glance

Dependency boundaries are strict:

```txt
apps/app -> buyer, seller, common, sdk, ui
apps/server -> common only
buyer, seller -> common, sdk, ui
common -> sdk, ui
sdk, ui -> no @zbav-se.me dependencies
```

## Contributing

Issues and PRs are welcome for bug reports, quality improvements, and architecture feedback.

Before handoff, run at least:

```bash
bun run lint
bun run typecheck
```

## Dependency Hygiene

- Dependency cleanup decisions in this repository are evidence-based from source usage.
- `knip` is treated as a candidate signal, not as the source of truth.

## MCP

Shared MCP server template is in [`mcp.json`](./mcp.json).

- Endpoint: `https://api.zbav-se.me.localhost:1355/api/mcp`
- Auth env var: `MCP_BEARER_TOKEN`
- Transport: `streamable_http`

Note: Codex desktop currently reads MCP server config from `~/.codex/config.toml`.
