# Zbav se mě!

A modern C2C marketplace monorepo.

This repo stays public for transparency and learning, but it is **not open source for commercial reuse**. Please read [LICENSE.md](./LICENSE.md) before using any part of the code.

## What is here

- `apps/app` - main marketplace app (buyer + seller flows)
- `apps/web` - public website and legal pages
- `apps/server` - API backend
- `apps/e2e` - Playwright end-to-end test workspace
- `apps/blog` - product/dev blog
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
cp .env.example .env.local
```

### Run everything

```bash
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

`bun run preview` is managed by Turbo. Each app builds its own production preview output first and then starts from that built output.

`bun run test` runs the existing Vitest suites first and then executes the root Playwright smoke suite against the production preview stack.

## Dev URLs

- Web: <http://localhost:3030>
- App: <http://localhost:3031>
- API: <http://localhost:3032>
- OpenAPI JSON: <http://localhost:3032/v3/api-docs>
- Blog: <http://localhost:4090>

## Architecture at a glance

Dependency boundaries are strict:

```txt
apps/app -> buyer, seller, common, sdk, ui
apps/web -> ui
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

- Endpoint: `http://obsidian-ii.local:3032/api/mcp`
- Auth env var: `MCP_BEARER_TOKEN`
- Transport: `streamable_http`

Note: Codex desktop currently reads MCP server config from `~/.codex/config.toml`.
