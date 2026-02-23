# AGENTS.md - Minimal Operating Guide for LLM Agents

## Purpose
Use this file as an execution guide. For product/domain rules, always use `MASTER.md` as the single source of truth.

## Language Rule
All file outputs must be in English (code, comments, docs, commit messages), regardless of user language.

## Agent Quick Start (P0)
1. Read `MASTER.md` before implementing business logic.
2. Respect domain boundaries (buyer/seller/session/user/public).
3. Do not bypass gates (sensitivity, bans, limits, lifecycle rules).
4. Keep server changes in `apps/server` (no domain package imports there).
5. Use Effect patterns and scoped logs in server handlers.
6. Preserve type safety (Kysely + Zod + generated SDK types).
7. If a `README.md` exists in the touched directory, update it.
8. Run relevant checks before finishing.
9. If a task becomes a longer side activity unrelated to the current Linear task, ask whether to create a new Linear issue before continuing.

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

## API Domain Split
- `/api/public/*`: Unauthenticated
- `/api/session/*`: Authenticated session
- `/api/user/*`: Private user context
- `/api/buyer-user/*`, `/api/buyer-session/*`
- `/api/seller-user/*`, `/api/seller-session/*`

Each domain usually contains:
- `with*ApiFx.ts` (Effect composition)
- `with*Hono.ts` (router)
- Domain modules (`fx/`, `db/`, `schema/`, etc.)

## Server Implementation Rules
- Use Effect for composition and DI (`Context.Tag`, `Effect.fn`, `Effect.gen`).
- Use Kysely query builders in `db/`.
- Validate request/response shapes with Zod schemas.
- Use Better Auth user context from Hono (`c.get("user")`).

### Logging Requirement (Axiom)
For new server endpoints and Effect-based flows:
1. Add scoped annotations at handler start:
```ts
yield* Effect.annotateLogsScoped({ endpoint: "stableEndpointName", userId: user.id });
```
2. Emit a success log at the end with the same endpoint name:
```ts
yield* Effect.log("stableEndpointName");
```
Without the final log, the event is not shipped.

## Frontend Implementation Rules
- Router: TanStack Router (file-based routes).
- Data: TanStack Query with SDK hooks.
- Forms: TanStack Form.
- Shared code placement:
  - Buyer logic: `@zbav-se.me/buyer`
  - Seller logic: `@zbav-se.me/seller`
  - Domain-agnostic shared: `@zbav-se.me/common`
  - Pure UI: `@zbav-se.me/ui`
- i18n: use `translator.text(key, fallback?)`; keys are collected automatically.

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

## Minimal Delivery Checklist
Before finishing implementation:
1. Business logic aligned with `MASTER.md`.
2. Boundaries respected (domain + dependencies).
3. Schemas, queries, and errors follow existing patterns.
4. Scoped logs added for server handlers.
5. Relevant `README.md` files updated where applicable.
6. Run and pass relevant checks (or clearly report what was not run).

## References
- Product and domain truth: `MASTER.md`
- Server Axiom wiring:
  - `apps/server/src/@common/axiom/fx/withLoggingFx.ts`
  - `apps/server/src/schema/env/ServerAxiomSchema.ts`
