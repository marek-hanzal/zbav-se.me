# AGENTS.md (shared)

## Source of truth
- Product/domain logic: `MASTER.md`.
- This file: shared implementation policy.
- App-specific rules:
  - `apps/app/AGENTS.md`
  - `apps/web/AGENTS.md`
  - `apps/server/AGENTS.md`

## Global rules (hard)
1. Output language in files: English.
2. Respect domain boundaries (`public/session/user/buyer/seller`).
3. Do not bypass gates (sensitivity, bans, lifecycle, limits).
4. Preserve type safety (Kysely + Zod + generated SDK types).
5. No ad-hoc local type files (`foo-props.ts`, `types.ts`, `type.ts`).
6. No inline complex types in signatures/vars (for example `Record<string, {...}>`).
7. Define named aliases in local namespace of consumer (component/function/module).
8. Namespace lettercase must match symbol lettercase (`foo -> namespace foo`, `Bar -> namespace Bar`).
9. If touched directory has `README.md`, update it.
10. Run relevant checks.
11. If work drifts into long side-task outside current Linear task, ask to open a new Linear issue.

## Monorepo dependency boundaries (hard)
```txt
apps/app -> buyer, seller, common, sdk, ui
apps/web -> ui
apps/server -> common only (no @zbav-se.me domain packages)
buyer, seller -> common, sdk, ui
common -> sdk, ui
sdk, ui -> no @zbav-se.me dependencies
```

## SDK policy (shared)
- `packages/@zbav-se.me/sdk/src/api/*` and `*.gen.ts` are generated-only.
- Custom wrappers go to `src/query/*` and `src/mutation/*`.
- Query wrapper: `withQuery<Req, Res[200]>`, stable keys, return `res.data`.
- Collection resources: use `withCollectionQuery` (`key`, `collectionQuery`, `fetchQuery`, `countQuery`, `patchMutation`, `toIdKey`).
- Export chain must be complete via local/parent `index.ts`.
- Contract changes -> run `bun run sdk` from repo root.

## Domain invariants (hard, see MASTER.md)
- No pay-to-win for trust/reputation.
- Sensitivity/admin-ban are hard gates (404 behavior).
- Terminal transaction states are read-only.
- Automatic expiration must stay intact.
- Minimal PII model must stay intact.

## Root commands
- `bun install`
- `bun run dev|build|preview`
- `bun run format|lint|typecheck|test|sdk|workflow:check`

## Formatting baseline
- Biome: tabs, line width 100.
