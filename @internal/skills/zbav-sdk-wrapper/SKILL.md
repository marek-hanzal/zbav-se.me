---
name: zbav-sdk-wrapper
description: Create or update SDK query and mutation wrappers in packages/@zbav-se.me/sdk with local naming, key, export, and withCollectionQuery patterns.
---

# Zbav SDK Wrapper

## Use this when
- Adding or updating SDK wrappers in `packages/@zbav-se.me/sdk/src/query/**`
- Adding or updating wrappers in `packages/@zbav-se.me/sdk/src/mutation/**`
- Adapting wrappers to changed OpenAPI contracts

## Required repo conventions
1. Treat `src/api/*` and `*.gen.ts` as generated files; do not hand-edit generated artifacts.
2. Query wrappers use `withQuery<Req, Res[200]>`.
3. Mutation wrappers use `withMutation<Req, Res[200], Err>`.
4. Query wrappers call generated APIs with `throwOnError: true` and return `res.data`.
5. Export wrappers from local `index.ts` and re-export from parent domain `index.ts`.

## Collection rule (important)
For collection resources (collection + fetch + count + patch), create an aggregate `withXxxQuery` using:
- `withCollectionQuery` from `packages/@use-pico/client/src/query/withCollectionQuery.ts`
- shape: `key`, `collectionQuery`, `fetchQuery`, `countQuery`, `patchMutation`, `toIdKey`

## Workflow
1. Confirm endpoint contract in generated API types.
2. Create/update wrapper file under correct domain/feature path.
3. Keep stable semantic keys (`["entity", "operation", data]`).
4. Update exports (`index.ts`) up the tree.
5. If contract changed, run `bun run sdk` from repo root.
6. Run relevant type/lint checks.

## Output expectations
- Wrapper signatures align with generated types.
- Keys and naming follow existing repo style.
- Exports are complete and import paths stay stable.
