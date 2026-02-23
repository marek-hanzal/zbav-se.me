# AGENTS.md - apps/app

## Scope
Rules for `apps/app` (main PWA).
Also follow root `/AGENTS.md` for shared rules.

## Architecture and Boundaries
- Keep UI and logic inside matching app domains (`@buyer-user`, `@buyer-session`, `@seller-user`, `@seller-session`, `@session`, `@user`, `@public`, `@common`).
- Do not mix buyer and seller domain logic.
- Use SDK surfaces matching folder/domain boundaries.

## Component Authoring Pattern
- Prefer:
  - `export namespace ComponentName { export interface Props ... }`
  - `export const ComponentName: FC<ComponentName.Props>`
- Extend base UI props where appropriate (`Container.Props`, `Button.Props`, ...).
- Destructure `ui` and `...props`, merge defaults with `...ui` last.
- Keep wrappers pass-through friendly (`...props`).
- Use small `hooks` prop objects for grouped callbacks when a component has multiple actions.

## `data-ui` Naming Contract
Use bracketed semantic labels:
- Root/primary node: `Component[Element]`
- Nested/child node: `Component-[Element]`
- Optional qualifier: `Component[Element.qualifier]` or `Component-[Element.qualifier]`
- Dynamic variant (controlled values only): ``Component-[Button.${value}]``

Conventions:
- `Component` and `Element` in PascalCase.
- Qualifier in lowercase (`empty`, `spinner`, `content`, ...).
- Keep names semantic and stable; do not encode position/order.
- If you touch older free-form names, normalize them to bracketed form in the same change.

## Data and State
- Prefer SDK query wrappers and existing Suspense patterns where already used.
- Reuse existing hooks and UI abstractions from `@use-pico/client` and `@zbav-se.me/*` packages.
- Use `translator.text(key, fallback?)` for translatable labels; key collection is automatic.

## App Route and File Placement
- Routes are file-based under `src/@routes`.
- Keep domain components under `src/app/<domain>/...`.
- Put shared app-only building blocks under `src/app/@common` (only if truly cross-domain).

## Checklist for app changes
1. Correct domain folder and SDK surface.
2. Component matches local authoring style.
3. `data-ui` markers follow contract.
4. Translation keys added via `translator.text` where needed.
5. Relevant checks run.
