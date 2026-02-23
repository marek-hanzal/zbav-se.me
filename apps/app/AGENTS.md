# AGENTS.md (apps/app)

## Scope
- Applies to `apps/app`.
- Also follow `/AGENTS.md`.

## Domain boundaries (hard)
- Keep code in correct app domain folder (`@public/@session/@user/@buyer-session/@buyer-user/@seller-session/@seller-user/@common`).
- No buyer<->seller cross-domain leakage.
- Use only SDK surfaces allowed by domain README rules.

## Component policy (hard)
1. Exactly one React component per file.
2. If file has multiple components, split into separate files.
3. No ad-hoc type holder files (`foo-props.ts`, `types.ts`, `type.ts`).
4. No inline complex types; create named alias in local namespace.
5. Namespace lettercase must match symbol lettercase.

## Component style (default)
- Prefer:
  - `export namespace ComponentName { export interface Props ... }`
  - `export const ComponentName: FC<ComponentName.Props>`
- Extend base UI props when applicable (`Container.Props`, `Button.Props`, ...).
- Merge `ui` defaults with `...ui` last.
- Keep wrappers pass-through (`...props`).
- Use grouped `hooks` prop for multi-callback components.

## data-ui contract
- Root: `Component[Element]`
- Child: `Component-[Element]`
- State: `Component[Element.state]` or `Component-[Element.state]`
- Dynamic variant: ``Component-[Button.${value}]``
- Naming: `Component/Element` PascalCase, `state` lowercase, semantic/stable only.
- If touching legacy free-form labels, normalize to bracket format.

## Data/i18n/routes
- Reuse existing SDK wrappers + Suspense patterns where present.
- Use `translator.text(...)` for translatable labels.
- Routes live in `src/@routes`; domain UI in `src/app/<domain>`.
- `@common` only for truly cross-domain app-level shared code.
