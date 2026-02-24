---
name: zbav-readme-sync
description: Update README files in touched domains/features so docs remain aligned with recent code changes and boundary rules.
---

# Zbav README Sync

## Use this when
- A change touches directories that contain `README.md`
- Domain scope/import rules/features changed
- AGENTS requires README maintenance for touched areas

## Documentation policy
- Keep README updates factual and local to changed behavior.
- Prefer concise sections: scope, rules, recent updates.
- Do not add speculative roadmap content.

## Workflow
1. Identify changed directories (`git status --short`, `git diff --name-only`).
2. For each touched path, check for local `README.md`.
3. Update impacted sections only (overview/scope/rules/recent updates).
4. Verify import/dependency statements match actual code boundaries.
5. Keep wording in English and consistent with existing docs.

## Output expectations
- README changes are minimal, accurate, and directly tied to the code diff.
