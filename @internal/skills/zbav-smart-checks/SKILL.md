---
name: zbav-smart-checks
description: Run diff-aware quality checks in this monorepo (lint/typecheck/test/sdk) to validate changes quickly while reporting what was and was not executed.
---

# Zbav Smart Checks

## Use this when
- Validating changes efficiently without always running full monorepo checks
- Selecting smallest sufficient check set based on touched files

## Check selection heuristics
- Server-only changes: prioritize server typecheck/tests and root lint.
- SDK wrappers/contracts: run `bun run sdk` (if contract changed), then typecheck.
- App/web UI-only changes: lint + typecheck for affected workspace, escalate to root checks if cross-cutting.
- Cross-domain/core changes: run root `bun run workflow:check`.

## Baseline commands
- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run sdk`
- `bun run workflow:check`

## Workflow
1. Inspect diff and classify impacted areas (`apps/app`, `apps/web`, `apps/server`, `packages`).
2. Run targeted checks first.
3. Escalate to broader checks when shared/core files are touched.
4. Report:
- commands run
- pass/fail summary
- skipped checks and why

## Output expectations
- Fast feedback with explicit coverage and clear residual risk when some checks are skipped.
