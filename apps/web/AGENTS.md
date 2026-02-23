# AGENTS.md (apps/web)

## Scope
- Applies to `apps/web`.
- Inherits all rules from `/AGENTS.md`.

## Intent
- Public marketing/auth/legal site.
- Keep implementation minimal and content-first.

## Boundaries
- No buyer/seller private app-domain logic.
- Reuse shared UI and existing public/session-facing flows.

## Route and page pattern
- File routes in `src/@routes`.
- Keep route files thin; move reusable logic/UI to `src/app/*`.
- Keep redirect/index behavior explicit.

## Data and auth pattern
- Public backend data: prefer SDK public query wrappers.
- Auth flows: use existing `src/app/auth/*` client and mutation wrappers.
- Session reads: follow `src/app/session/useSession.ts`.

## UI and content
- Use `translator.text(...)` for user-facing strings.
- Content markdown under `src/@md/*`, wiring under `src/@routes/*`.
- Exactly one React component per file (split when violated).
- Keep `data-ui` stable for key interactive and structured nodes.
