# AGENTS.md (apps/server)

## Scope
- Applies to `apps/server`.
- Inherits all rules from `/AGENTS.md`.

## API domains
- `/api/public/*`
- `/api/session/*`
- `/api/user/*`
- `/api/buyer/*`
- `/api/seller/*`

## Architecture contract (hard)
- Per domain keep: `with*ApiFx.ts` (aggregator), `with*Hono.ts` (typed hono), feature modules (`fx/db/schema/endpoint`).
- Public/root hono uses `user | null`.
- Session/user/buyer/seller honos require authenticated `user`; runtime guards must match this.

## Aggregator pattern (`with*ApiFx.ts`)
1. Resolve `{ root, domainHono }` from `RoutesContextFx` and `kysely` from `KyselyContextFx`.
2. Attach `kysely` via `domainHono.use(...)`.
3. Auth domains register `root.use('/api/<domain>/*', ...)` guard returning `401 { type:'error', message:'Shooooo! Shooo!' }`.
4. Register feature effects (commonly `Effect.all([...])`).
5. Mount via `root.route('/api/<domain>', domainHono)`.

## Endpoint contract
- Register endpoints via `domainHono.openapi(createRoute(...), async (c) => ...)`.
- Keep Zod request/response schemas (`NoticeSchema` for error payloads).
- In handlers use `Effect.gen` and `zodGuardFx` around domain effects.
- Keep pipe order: `withKyselyFx` -> optional infra layers -> `withCatchFx` -> `Effect.runPromise`.

## Logging, errors, OpenAPI
- Keep stable `endpoint` and `operationId` (`api*`).
- Map errors with `noticeError`, `noticeZodError`, `NotFoundNotice` as appropriate.
- Add new tag names to `apps/server/src/@public/open-api/open-api.ts` tag registry.

## Data rules
- Use domain `db/` query builders.
- Apply required user scoping.
- Validate boundaries at API edge with Zod.
