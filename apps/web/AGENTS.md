# AGENTS.md (apps/web)

## Scope
- Applies to `apps/web`.
- Also follow `/AGENTS.md`.

## Intent
- Public marketing/auth/legal site.
- Keep minimal and content-first.

## Boundaries
- No buyer/seller private app-domain logic.
- Reuse shared UI + existing public/session-facing flows.

## Route/page pattern
- File routes in `src/@routes`.
- Keep route files thin; move reusable logic/UI to `src/app/*`.
- Keep redirect/index behavior explicit.

## Data/auth pattern
- Public backend data: prefer SDK public query wrappers.
- Auth flows: use existing `src/app/auth/*` client+mutation wrappers.
- Session read pattern: follow `src/app/session/useSession.ts`.

## UI/content policy
- Use `translator.text(...)` for strings.
- Content markdown under `src/@md/*`, wiring under `src/@routes/*`.
- Exactly one React component per file; split when violated.
- Keep `data-ui` stable for key interactive/structured nodes.
