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
sudo portless proxy start --https
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

`bun run preview` is managed by Turbo. The frontend app and server build their production preview outputs first and then start from those built outputs.

`bun run test` runs the existing Vitest suites.

The local Postgres Docker image is tagged as `zbav-se.me:postgres` so Docker Compose and test setup reuse the same build cache and image name.

## Dev URLs

- App: <https://zbav-se.me.localhost>
- API: <https://api.zbav-se.me.localhost>
- OpenAPI JSON: <https://api.zbav-se.me.localhost/v3/api-docs>

The app and server scripts stay as plain `portless ...` commands. To get clean HTTPS URLs without ports, start the shared proxy once with `sudo portless proxy start --https --port 443` and let the app scripts reuse it.

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

- Endpoint: `https://api.zbav-se.me.localhost/api/mcp`
- Auth env var: `MCP_BEARER_TOKEN`
- Transport: `streamable_http`

Note: Codex desktop currently reads MCP server config from `~/.codex/config.toml`.
