# AGENTS.md - Shared Operating Rules

## Purpose
This file contains shared rules for the whole monorepo.
For product/domain business logic, always use `MASTER.md` as the single source of truth.

## Language Rule
All file outputs must be in English (code, comments, docs, commit messages), regardless of user language.

## Scope Split
Use this file for shared rules, then load the app-specific guide:
- `apps/app/AGENTS.md` for PWA (`apps/app`)
- `apps/web/AGENTS.md` for public site (`apps/web`)
- `apps/server/AGENTS.md` for API (`apps/server`)

## Shared P0 Rules
1. Read `MASTER.md` before implementing business logic.
2. Respect domain boundaries (buyer/seller/session/user/public).
3. Do not bypass gates (sensitivity, bans, limits, lifecycle rules).
4. Preserve type safety (Kysely + Zod + generated SDK types).
5. If a `README.md` exists in the touched directory, update it.
6. Run relevant checks before finishing.
7. If a task becomes a longer side activity unrelated to the current Linear task, ask whether to create a new Linear issue before continuing.

## Monorepo Map
- `apps/app`: Main PWA (React 19, TanStack Router/Start)
- `apps/web`: Public website
- `apps/server`: API (Hono, Nitro, PostgreSQL, Kysely, Better Auth, Redis, S3)
- `packages/@zbav-se.me/*`: `sdk`, `ui`, `common`, `buyer`, `seller`
- `packages/@use-pico/*`: Internal framework (`client`, `common`, `server`)

## Dependency Boundaries (Must Keep)
```txt
apps/app -> buyer, seller, common, sdk, ui
apps/web -> ui
apps/server -> common only (no @zbav-se.me domain packages)
buyer, seller -> common, sdk, ui
common -> sdk, ui
sdk, ui -> no @zbav-se.me dependencies
```

## SDK Rules (Shared)
- Treat `packages/@zbav-se.me/sdk/src/api/*` and `*.gen.ts` as generated; do not hand-edit generated files.
- Add manual wrappers under `packages/@zbav-se.me/sdk/src/query/<domain>/<feature>/withXxxQuery.ts`.
- Standard wrapper pattern:
  1. `withQuery<RequestType, ResponseType[200]>({...})`
  2. `keys(data)` returns stable semantic keys (`["entity", "operation", data]`)
  3. `queryFn(...)` calls generated API with `throwOnError: true` and returns `res.data`
- For collection resources (collection + fetch + count + patch), use `withCollectionQuery` from `packages/@use-pico/client/src/query/withCollectionQuery.ts` and expose aggregate `withXxxQuery` (example: `withFeedQuery.ts`).
- In `withCollectionQuery` aggregate files, keep this shape: `key`, `collectionQuery`, `fetchQuery`, `countQuery`, `patchMutation`, `toIdKey`.
- Export from local `index.ts` and re-export through parent domain `index.ts`.
- If API contracts change, regenerate from repo root with `bun run sdk`.

## Domain Safety Invariants (Do Not Break)
Keep these enforced; details live in `MASTER.md`:
- No pay-to-win for trust/reputation signals.
- Sensitivity and admin bans are hard gates (404 behavior as specified in `MASTER.md`).
- Terminal transaction states are read-only.
- Automatic expiration behavior must remain intact.
- Minimal PII approach remains intact.

## Tooling & Commands (Repo Root)
- Package manager: `bun` (single root `bun.lock`)
- Install: `bun install`
- Dev: `bun run dev`
- Build: `bun run build`
- Preview: `bun run preview`
- Format: `bun run format`
- Lint: `bun run lint`
- Typecheck: `bun run typecheck`
- Test: `bun run test`
- SDK generation: `bun run sdk`
- CI-like gate: `bun run workflow:check`

Biome baseline:
- Tabs for indentation
- Line width 100

## Final Checklist
1. Business logic aligned with `MASTER.md`.
2. Domain/dependency boundaries respected.
3. App-specific AGENTS rules were followed.
4. Relevant checks passed (or clearly reported if not run).
