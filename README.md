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
