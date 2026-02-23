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

## Direct Hints From Current Codebase
Use these patterns by default unless the surrounding code clearly does something else.

### Component Style (apps/app)
- Co-locate UI by domain and feature (`.../ui/...`), keep role/session boundaries intact.
- Prefer `export namespace ComponentName { export interface Props ... }` + `export const ComponentName: FC<ComponentName.Props>`.
- Extend base UI props when relevant (often `Container.Props` or `Button.Props`).
- Destructure `ui` and `...props`, then merge defaults with `...ui` (consumer override last).
- Keep wrappers pass-through friendly (`...props`) and expose small `hooks` objects for callbacks when a component has multiple actions.
- Add stable `data-ui` markers for important nodes using the naming contract below.
- Use SDK query wrappers in Suspense style where already used (`<withXxxQuery.Suspense data={...}>`).

#### `data-ui` Naming Contract
Based on current codebase scan (189 markers), use this format for new code:

- Root or primary node: `Component[Element]`
  - Examples: `ListingDetail[Container]`, `SaveContainer[Container]`, `PriceValue[LabelValue]`
- Nested/child node: `Component-[Element]`
  - Examples: `ListingDetail-[HeroImage]`, `Transaction-[MessageListContainer]`
- Optional qualifier/state: `Component[Element.qualifier]` or `Component-[Element.qualifier]`
  - Examples: `ListContainer[Container.empty]`, `PhotoUpload-[Status.spinner]`
- Dynamic variant: only for controlled item variants, usually button/value options
  - Example: ``WarrantySelect-[Button.${warranty}]``

Conventions:
- Use `Component` and `Element` in PascalCase.
- Use lowercase for qualifier/state (`empty`, `spinner`, `content`, ...).
- Keep names semantic and stable; do not encode visual position/order (`left`, `first`, `col2`).
- Prefer bracketed form over free-form strings.
- Existing non-bracket legacy forms (`CategorySelectionContainer`, `ListingSortSelect`, `ListingLocation-root`, `PhotoUpload-Input`) may remain, but do not use them as pattern for new code.

### SDK Style (packages/@zbav-se.me/sdk)
- Treat `src/api/*` and `*.gen.ts` as generated; do not hand-edit generated files.
- Add manual query wrappers under `src/query/<domain>/<feature>/withXxxQuery.ts`.
- For new collection-style resources (collection + fetch + count + patch), use `withCollectionQuery` from `packages/@use-pico/client/src/query/withCollectionQuery.ts` and expose an aggregate `withXxxQuery` (example: `withFeedQuery.ts`).
- Query wrapper pattern:
  1. `withQuery<RequestType, ResponseType[200]>({...})`
  2. `keys(data)` returns `["entity", "operation", data]`
  3. `queryFn(body|path)` calls `apiXxx({ body|path, throwOnError: true }).then((res) => res.data)`
- In `withCollectionQuery` aggregate files, keep this shape: `key`, `collectionQuery`, `fetchQuery`, `countQuery`, `patchMutation`, `toIdKey`.
- Export wrappers from local `index.ts`, then re-export from parent domain `index.ts`.
- If API contract changes, regenerate SDK from repo root with `bun run sdk`.

### Server Endpoint Style (apps/server)
- One endpoint file per operation (for example `create.ts`, `fetch.ts`, `seller-info.ts`) and a domain `with*ApiFx.ts` aggregator.
- Endpoint function pattern:
  1. `export const withXxxApiFx = Effect.fn("withXxxApiFx")(function* () { ... })`
  2. Register route with `createRoute(...)` + stable `operationId` (`api...`)
  3. Use Zod schemas from domain `schema/` in request/response
  4. In handler: parse env (`ServerAxiomSchema` + any needed env), then `Effect.gen(...)`
  5. Inside effect: get user (`c.get("user")`), annotate logs (`Effect.annotateLogsScoped`), run domain fx through `zodGuardFx`, return `c.json(..., status)`
  6. Pipe with `withLoggingFx`, `withKyselyFx`, optional infra layers (`withDateFx`, `withLocationFx`, ...), `withCatchFx`, `Effect.runPromise`
- Use domain errors in `withCatchFx` and map them to `NoticeSchema` responses with existing status code conventions.

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
