---
name: zbav-sdk-wrapper
description: Create or update SDK query and mutation wrappers in packages/@zbav-se.me/sdk with local naming, key, export, and withEntityQuery patterns.
---

# Zbav SDK Wrapper

## Use this when
- Adding or updating SDK wrappers in `packages/@zbav-se.me/sdk/src/query/**`
- Adding or updating wrappers in `packages/@zbav-se.me/sdk/src/mutation/**`
- Adapting wrappers to changed OpenAPI contracts

## Required repo conventions
1. Treat `src/api/*` and `*.gen.ts` as generated files; do not hand-edit generated artifacts.
2. For entity resources (fetch + collection + count, optionally patch), use `withEntityQuery` from `@use-pico/client/query`.
3. `withEntityQuery` wrappers should call generated APIs via `withApi(...)` and return typed entities/count directly.
4. For simple non-entity queries, use `withQuery<Req, Res[200]>`.
5. For explicit mutation wrappers, use `withMutation<Req, Res[200], Err>`.
6. Export wrappers from local `index.ts` and re-export from parent domain `index.ts`.

## Entity rule (important)
For entity resources, create a single aggregate `withXxxQuery` using:
- `withEntityQuery<TEntity, TFetchRequest, TCollectionRequest, TCountRequest, TPatchRequest>`
- shape: `keys`, `toIdKey`, `fetch`, `collection`, `count`, `patch`
- use stable base keys like `["feed"]`, `["draft"]`, `["category"]` (without operation suffix)

### When patch is not supported
- set `TPatchRequest` to `never`
- provide `patch` that throws a clear runtime error (for example `"X patch is not supported."`)
- do not create noop patch adapters

## Workflow
1. Confirm endpoint contract in generated API types.
2. Choose helper:
   - `withEntityQuery` for entity resources
   - `withQuery` / `withMutation` for standalone operations
3. Create/update wrapper file under correct domain/feature path.
4. Keep stable key prefixes and canonical `toIdKey` mapping.
5. Update exports (`index.ts`) up the tree.
6. If contract changed, run `bun run sdk` from repo root.
7. Run relevant type/lint checks.

## Migration note (legacy wrappers)
When migrating old `withCollectionQuery` wrappers:
- replace aggregate composition (`collectionQuery`/`fetchQuery`/`countQuery`/`patchMutation`) with one `withEntityQuery`
- switch app call sites to `useFetchQuery`, `useCollectionQuery`, `useCountQuery`, `usePatchMutation`
- remove old helper-specific API usage (`useQuery`, `useCount`, noop patch adapters)

## Output expectations
- Wrapper signatures align with generated types and `withEntityQuery` generic parameters.
- Keys and naming follow existing repo style and remain stable.
- Exports are complete and import paths stay stable.
