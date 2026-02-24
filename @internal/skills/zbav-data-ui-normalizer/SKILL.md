---
name: zbav-data-ui-normalizer
description: Audit and normalize data-ui labels in app/web components to the project's bracketed naming contract while preserving stable selectors.
---

# Zbav data-ui Normalizer

## Use this when
- Auditing `data-ui` consistency
- Normalizing legacy labels to bracketed contract
- Preparing UI selectors for stable testing and tooling

## Contract to enforce
- Root: `Component[Element]`
- Child: `Component-[Element]`
- Qualifier: `Component[Element.state]` or `Component-[Element.state]`
- Dynamic variant: ``Component-[Button.${value}]``

## Safety rules
1. Normalize incrementally by feature/domain.
2. Avoid changing semantics; rename labels only.
3. Keep dynamic tokens only where value-controlled variants are intended.
4. Report any potentially breaking selector changes.

## Workflow
1. Scan target paths with `rg -n "data-ui="`.
2. Identify non-bracketed or inconsistent labels.
3. Apply focused renames.
4. Re-scan for old labels and collisions.
5. Run lint and report all renamed markers.

## Output expectations
- Consistent bracketed labels and a concise before/after mapping.
