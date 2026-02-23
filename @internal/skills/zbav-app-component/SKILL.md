---
name: zbav-app-component
description: Build or refactor apps/app components in the project's established style (namespace Props, ui merge, data-ui contract, domain boundaries, and SDK query Suspense usage).
---

# Zbav App Component

## Use this when
- Creating or refactoring components in `apps/app/src/app/**`
- Moving code between app domains while preserving boundaries
- Standardizing component style and `data-ui` labels

## Required component style
1. Keep exactly one React component per file.
2. If you encounter multiple components in one file, split them into separate files.
3. Prefer:
- `export namespace ComponentName { export interface Props ... }`
- `export const ComponentName: FC<ComponentName.Props>`
4. Extend base UI props where appropriate (`Container.Props`, `Button.Props`, ...).
5. Merge default `ui` with caller `ui` (`...ui` last).
6. Keep wrappers pass-through friendly with `...props`.
7. Use small `hooks` prop objects when there are multiple callbacks.

## data-ui contract
- Root node: `Component[Element]`
- Child node: `Component-[Element]`
- State/qualifier: `Component[Element.state]` or `Component-[Element.state]`
- Dynamic variant (controlled values): ``Component-[Button.${value}]``

Naming:
- `Component` and `Element` in PascalCase.
- `state`/qualifier in lowercase.
- Keep labels semantic and stable (not positional).

## Domain constraints
- Keep buyer/seller/session/user/public boundaries intact.
- Reuse existing SDK wrappers and Suspense patterns where already present.
- Use `translator.text(...)` for translatable UI strings.

## Workflow
1. Identify target app domain and allowed dependencies.
2. Implement component in local style.
3. Add/normalize `data-ui` labels.
4. Reuse SDK query/mutation hooks from proper domain.
5. Run relevant checks.

## Output expectations
- Component fits local architecture and style without introducing cross-domain leaks.
