# AGENTS.md - apps/server

## Scope
Rules for `apps/server` (Hono + Effect + Kysely API).
Also follow root `/AGENTS.md` for shared rules.

## Domain Routing Model
- Public: `/api/public/*`
- Authenticated session: `/api/session/*`
- Private user: `/api/user/*`
- Buyer: `/api/buyer-user/*`, `/api/buyer-session/*`
- Seller: `/api/seller-user/*`, `/api/seller-session/*`

Each top-level domain uses:
- `with*ApiFx.ts` as domain aggregator/registration
- `with*Hono.ts` for typed Hono instance
- Feature modules (`fx/`, `db/`, `schema/`, endpoint files)

Typing note:
- `withPublicHono`/root Hono allow `user: auth.User | null`.
- Session/user/buyer/seller domain Hono types assume authenticated `user: auth.User`; keep matching runtime guards in domain aggregators.

## Domain Aggregator Pattern (`with*ApiFx.ts`)
Follow existing pattern:
1. Read `{ root, domainHono }` from `RoutesContextFx`.
2. Read Kysely from `KyselyContextFx`.
3. Attach `kysely` via `domainHono.use(...)`.
4. For authenticated domains, add `root.use('/api/<domain>/*', auth guard)` returning 401 `{ type: 'error', message: 'Shooooo! Shooo!' }`.
5. Register feature APIs (usually `Effect.all([...])`).
6. Mount with `root.route('/api/<domain>', domainHono)`.

## Endpoint Blueprint (operation file)
Typical endpoint file shape:
1. `export const withXxxApiFx = Effect.fn('withXxxApiFx')(function* () { ... })`
2. Register route via `domainHono.openapi(createRoute({...}), async (c) => { ... })`
3. Use domain Zod schemas for request and responses (`NoticeSchema` for errors)
4. In handler:
   - parse env (`ServerAxiomSchema` + any feature env)
   - `Effect.gen` body
   - read `user` from `c.get('user')` when relevant
   - call `Effect.annotateLogsScoped({ endpoint, userId, ... })`
   - run domain fx via `zodGuardFx`
   - return `c.json(..., status)`
5. Pipe with:
   - `withLoggingFx(...)`
   - `withKyselyFx(c.get('kysely'))`
   - optional infra layers (`withDateFx`, `withLocationFx`, ...)
   - `withCatchFx({ ...mapped errors... })`
   - `Effect.runPromise`

## Logging and Error Conventions
- Always annotate logs in handler scope with stable `endpoint` name.
- Ensure successful completion is logged according to `withLoggingFx` flow.
- Map domain errors in `withCatchFx` to API responses using existing notice helpers:
  - `noticeError`
  - `noticeZodError`
  - `NotFoundNotice` where applicable

## OpenAPI Conventions
- Keep `operationId` stable and `api*` prefixed.
- Include clear `summary`, `description`, `tags`, and typed response schema per status.
- If you introduce new tag names, update tag metadata registry in `apps/server/src/@public/open-api/open-api.ts`.

## Data Access and Validation
- Use Kysely query builders from domain `db/` folders.
- Apply scope-aware queries when user context is required.
- Validate boundaries with Zod at API edges.

## Checklist for server changes
1. Domain and route prefix are correct.
2. Aggregator pattern (`with*ApiFx`) preserved.
3. Endpoint follows Effect + logging + catch pipeline.
4. Error mapping uses existing notice conventions.
5. OpenAPI metadata is complete and consistent.
6. Relevant checks/tests run.
