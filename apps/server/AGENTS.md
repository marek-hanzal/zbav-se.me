# AGENTS.md (apps/server)

## Scope
- Applies to `apps/server`.
- Also follow `/AGENTS.md`.

## API domains
- `/api/public/*`
- `/api/session/*`
- `/api/user/*`
- `/api/buyer-user/*`, `/api/buyer-session/*`
- `/api/seller-user/*`, `/api/seller-session/*`

## Architecture contract
- Per domain: `with*ApiFx.ts` (aggregator), `with*Hono.ts` (typed hono), feature modules (`fx/db/schema/endpoint`).
- Public/root hono: `user | null`.
- Session/user/buyer/seller hono: authenticated `user`; keep runtime guards aligned.

## Domain aggregator pattern (`with*ApiFx.ts`)
1. Get `{ root, domainHono }` from `RoutesContextFx` and `kysely` from `KyselyContextFx`.
2. `domainHono.use(...)` sets `kysely`.
3. Auth domains add guard on `root.use('/api/<domain>/*', ...)` -> `401 { type:'error', message:'Shooooo! Shooo!' }`.
4. Register features (usually `Effect.all([...])`).
5. Mount `root.route('/api/<domain>', domainHono)`.

## Endpoint blueprint
1. `withXxxApiFx = Effect.fn(...)(function*(){...})`
2. `domainHono.openapi(createRoute(...), async (c) => ...)`
3. Zod request/response schemas (`NoticeSchema` for errors).
4. Handler uses `Effect.gen`:
- parse env (`ServerAxiomSchema` + feature env)
- read `c.get('user')` when needed
- `Effect.annotateLogsScoped({ endpoint, userId, ... })`
- `zodGuardFx` around domain fx
- `c.json(..., status)`
5. Pipe order:
- `withLoggingFx`
- `withKyselyFx`
- optional infra layers (`withDateFx`, `withLocationFx`, ...)
- `withCatchFx`
- `Effect.runPromise`

## Logging/errors/OpenAPI
- Stable `endpoint` and `operationId` (`api*`).
- Error mapping uses `noticeError`, `noticeZodError`, `NotFoundNotice` as appropriate.
- New tag names must be added to `apps/server/src/@public/open-api/open-api.ts` tag registry.

## Data rules
- Use domain `db/` query builders.
- Apply user scope where required.
- Validate boundaries at API edge with Zod.
