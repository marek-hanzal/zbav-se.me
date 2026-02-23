# AGENTS.md - apps/web

## Scope
Rules for `apps/web` (public marketing/auth website).
Also follow root `/AGENTS.md` for shared rules.

## Primary Intent
- `apps/web` is public-facing and content-oriented.
- Keep it lightweight: public routes, auth entry points, legal/content pages, and simple session-aware UX.

## Boundaries
- `apps/web` depends on UI/common infra and public/session-facing flows only.
- Do not introduce buyer/seller private app-domain logic here.

## Route and Page Patterns
- File-based routes under `src/@routes`.
- Route files should stay thin; move reusable blocks to `src/app/*`.
- Keep redirect/index route behavior explicit (for example locale redirects).

## Data and Auth Patterns
- For backend data on public pages, prefer SDK public query wrappers.
- For auth operations, use the existing auth client + mutation wrappers in `src/app/auth/*`.
- For lightweight session reads, follow existing query wrapper pattern in `src/app/session/useSession.ts`.

## Content and i18n
- Use `translator.text(...)` for UI strings.
- Keep translated markdown/content under `src/@md/*` and route wiring in `src/@routes/*`.

## UI Consistency
- Reuse shared UI primitives from `@use-pico/client` and `@zbav-se.me/ui`.
- Keep `data-ui` markers stable when adding significant interactive/structured blocks.

## Checklist for web changes
1. Change belongs to public web scope.
2. Route/component split stays clean.
3. Data/auth flow reuses existing query/mutation patterns.
4. Strings are translatable.
5. Relevant checks run.
