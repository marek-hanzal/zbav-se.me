---
name: zbav-server-endpoint
description: Create or modify apps/server endpoints using the repo's Effect + Hono + Zod + Kysely conventions, including with*ApiFx registration, scoped Axiom logging, and withCatchFx error mapping.
---

# Zbav Server Endpoint

## Use this when
- Adding a new endpoint in `apps/server/src/**`
- Updating request/response schemas for an existing endpoint
- Wiring a feature into a domain `with*ApiFx.ts`

## Required repo conventions
1. Endpoint operation lives in a focused file (for example `create.ts`, `fetch.ts`, `seller-info.ts`).
2. OpenAPI route is defined with `createRoute` and stable `operationId`.
3. Handler executes `Effect.gen(...).pipe(...)` with:
- `withLoggingFx`
- `withKyselyFx`
- optional infra layers (`withDateFx`, `withLocationFx`, ...)
- `withCatchFx`
- `Effect.runPromise`
4. Annotate logs in scope using `Effect.annotateLogsScoped({ endpoint, userId, ... })`.
5. Validate payload/output with `zodGuardFx` + Zod schemas.
6. Register endpoint from feature `with*ApiFx.ts` and mount domain route in top-level domain `with*ApiFx.ts` if needed.

## Workflow
1. Identify domain (`@public`, `@session`, `@user`, `@buyer-user`, `@buyer-session`, `@seller-user`, `@seller-session`).
2. Add/update schemas under domain `schema/`.
3. Add/update effect logic under domain `fx/` and db query builders under `db/` when needed.
4. Implement endpoint file with `createRoute` and effect pipeline.
5. Map known domain errors in `withCatchFx` to consistent status codes and `NoticeSchema` responses.
6. Wire endpoint through feature `with*ApiFx.ts` and ensure domain aggregator includes the feature.
7. Verify OpenAPI tags are meaningful and in existing style.
8. Run checks relevant to server changes.

## Auth and context reminders
- Domain aggregators set `kysely` on hono context.
- Authenticated domains must guard with 401 and message `Shooooo! Shooo!`.
- Use `c.get("user")` where user scope is required.

## Output expectations
- Endpoint code compiles and follows local pattern.
- OpenAPI schema reflects request/response changes.
- Errors and logs are wired in consistent style.
