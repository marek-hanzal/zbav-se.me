# AGENTS.md (shared)

## Source of truth
- Product/domain invariants: `MASTER.md`.
- Shared implementation policy: this file.
- App-specific overlays:
  - `apps/app/AGENTS.md`
  - `apps/web/AGENTS.md`
  - `apps/server/AGENTS.md`

## Global rules (hard)
1. Write file content in English.
2. Respect domain boundaries (`public/session/user/buyer/seller`).
3. Never bypass hard gates (sensitivity, bans, lifecycle, limits).
4. Preserve type safety (Kysely + Zod + generated SDK types).
5. No ad-hoc local type holder files (`foo-props.ts`, `types.ts`, `type.ts`).
6. No inline complex types in signatures/vars; define local named aliases.
7. Namespace lettercase must match symbol lettercase (`foo -> namespace foo`, `Bar -> namespace Bar`).
8. If touched directory has `README.md`, update it.
9. Run relevant checks before handoff.
10. If work drifts into a long side task outside the current Linear scope, ask for a new issue.

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
- Generated-only: `packages/@zbav-se.me/sdk/src/api/*` and `*.gen.ts`.
- Custom wrappers belong in `src/query/*` and `src/mutation/*`.
- Query wrappers: `withQuery<Req, Res[200]>`, stable keys, return `res.data`.
- Collections: use `withCollectionQuery` (`key`, `collectionQuery`, `fetchQuery`, `countQuery`, `patchMutation`, `toIdKey`).
- Keep export chain complete through local/parent `index.ts`.
- Contract changes require `bun run sdk` from repo root.

## Domain invariants (hard)
- No pay-to-win for trust/reputation.
- Sensitivity/admin-ban are hard 404 gates.
- Terminal transaction states are read-only.
- Automatic expiration must remain intact.
- Minimal PII model must remain intact.

## Root commands
- `bun install`
- `bun run dev|build|preview`
- `bun run format|lint|typecheck|test|sdk|workflow:check`

## Formatting baseline
- Biome: tabs, line width 100.
