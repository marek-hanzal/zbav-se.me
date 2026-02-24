---
name: zbav-cross-domain-import-guard
description: Audit and prevent cross-domain import leaks in apps/app and apps/server by checking domain boundaries for both SDK and app/server internal imports.
---

# Zbav Cross-Domain Import Guard

## Use this when
- Reviewing changes in `apps/app/src/app/**`
- Reviewing changes in `apps/server/src/**`
- Suspecting domain leakage through SDK or internal domain imports
- Enforcing buyer/seller/session/user/public boundary rules

## What this guards
Detect wrong imports for a given domain, especially:
- buyer domains importing seller SDK surfaces
- seller domains importing buyer SDK surfaces
- session/user/common importing role-specific surfaces unless explicitly allowed by local domain rules
- server domain modules importing disallowed higher/sibling domains

## Audit workflow
1. Build import matrix for app and server:
- `@zbav-se.me/sdk/api/*`
- `@zbav-se.me/sdk/query/*`
- `@zbav-se.me/sdk/mutation/*`
2. Build internal domain import matrix:
- app: `apps/app/src/app/@*/**` imports from `~/app/@*`
- server: `apps/server/src/@*/**` imports from `~/*` and `~/@*`
3. Group by domain folder (`@buyer-user`, `@seller-user`, `@session`, `@user`, `@common`, ...).
4. Compare observed imports against domain rules in:
- `apps/app/src/app/README.md`
- `apps/app/src/app/<domain>/README.md`
 - `apps/server/src/<domain>/README.md`
 - root and app/server `AGENTS.md`
5. Report findings with exact file paths and import lines.
6. Propose minimal-safe fixes:
- move code to correct domain
- switch to allowed SDK surface
- switch to allowed internal domain import
- or update docs if rule is intentionally changed

## Practical checks
- Hard fail candidates:
  - `@buyer-* -> sdk/*/seller-*`
  - `@seller-* -> sdk/*/buyer-*`
  - `apps/server/src/@session/** -> ~/@buyer-*|~/@seller-*|~/@user`
  - `apps/server/src/@public/** -> ~/@(session|user|buyer-*|seller-*)`
- Soft review candidates:
  - `@user` or `@common` importing role-specific SDK domains in app
  - any cross-domain import that is not explicitly covered in local README rules
  - any domain importing unrelated private SDK surface

## Output expectations
- A concise matrix:
- `app-domain -> sdk-domain`
- `app-domain -> app-domain`
- `server-domain -> server-domain`
- Findings list ordered by severity with path+line evidence.
- Clear recommendation whether code or docs should change.
