---
name: zbav-sdk-domain-leak-guard
description: Audit and prevent cross-domain SDK import leaks in apps/app by checking domain-to-SDK import boundaries and reporting violations with file-level evidence.
---

# Zbav SDK Domain Leak Guard

## Use this when
- Reviewing changes in `apps/app/src/app/**`
- Suspecting domain leakage through SDK imports
- Enforcing buyer/seller/session/user/public boundary rules

## What this guards
Detect wrong SDK domain imports for a given app domain, especially:
- buyer domains importing seller SDK surfaces
- seller domains importing buyer SDK surfaces
- session/user/common importing role-specific SDK surfaces unless explicitly allowed by local domain rules

## Audit workflow
1. Build import matrix from `apps/app/src/app/**` for:
- `@zbav-se.me/sdk/api/*`
- `@zbav-se.me/sdk/query/*`
- `@zbav-se.me/sdk/mutation/*`
2. Group by app domain folder (`@buyer-user`, `@seller-user`, `@session`, `@user`, `@common`, ...).
3. Compare observed imports against domain README rules in:
- `apps/app/src/app/README.md`
- `apps/app/src/app/<domain>/README.md`
4. Report findings with exact file paths and import lines.
5. Propose minimal-safe fixes:
- move code to correct domain
- switch to allowed SDK surface
- or update docs if rule is intentionally changed

## Practical checks
- Hard fail candidates:
  - `@buyer-* -> sdk/*/seller-*`
  - `@seller-* -> sdk/*/buyer-*`
- Soft review candidates:
  - `@user` or `@common` importing role-specific SDK domains
  - any domain importing unrelated private SDK surface

## Output expectations
- A concise matrix `app-domain -> sdk-domain`.
- Findings list ordered by severity with path+line evidence.
- Clear recommendation whether code or docs should change.
