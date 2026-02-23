# AGENTS.md (apps/app)

## Scope
- Applies to `apps/app`.
- Inherits all rules from `/AGENTS.md`.

## Domain boundaries (hard)
- Keep code in the correct app domain folder (`@public/@session/@user/@buyer-session/@buyer-user/@seller-session/@seller-user/@common`).
- No buyer <-> seller cross-domain leakage.
- Use only SDK surfaces allowed by domain README rules.
- Keep `@common` only for truly cross-domain app-level shared code.

## Component rules
- Exactly one React component per file (split when violated).
- Prefer namespace props pattern:
  - `export namespace ComponentName { export interface Props ... }`
  - `export const ComponentName: FC<ComponentName.Props>`
- Extend base UI props when applicable (`Container.Props`, `Button.Props`, ...).
- Merge `ui` defaults with `...ui` last.
- Keep wrappers pass-through (`...props`).
- For multi-callback components, prefer grouped `hooks` prop.

## `data-ui` contract
- Root: `Component[Element]`
- Child: `Component-[Element]`
- State: `Component[Element.state]` or `Component-[Element.state]`
- Dynamic variant: ``Component-[Button.${value}]``
- Naming: `Component/Element` PascalCase, `state` lowercase, semantic/stable only.
- If touching legacy free-form labels, normalize to bracket format.

## Data, i18n, routes
- Reuse existing SDK wrappers and Suspense patterns where present.
- Use `translator.text(...)` for translatable labels.
- Routes live in `src/@routes`; domain UI in `src/app/<domain>`.
- Every route must have its own `*Page` component in its domain UI folder.
- Route files may contain only route-specific hooks (`Route.useParams`, `Route.useSearch`, `Route.useLoaderData`, ...), then pass mapped data into the `*Page` component.
- `*Page` components must never import or call Route APIs directly; all route-derived data must be injected from outside.
