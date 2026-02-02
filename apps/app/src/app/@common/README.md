# @common

Common – shared resources and utilities across domains (no own API).

## Overview

This domain contains **shared components, types, and utilities** used by multiple other domains. It has no own API or routes; it serves as a source of shared functionality that any domain may import.

## Purpose

- Avoid code duplication across domains.
- Shared contexts and configuration (e.g. transaction context, upload context).
- Central shared business logic and types.
- Consistency at domain boundaries.

## What's Here (scope)

- **Shared UI** – buttons, forms, layout pieces without domain logic
- **Shared types** – types for transactions, transaction status, user events, listing (pros/cons, expire)
- **Shared schemas/validation** – validation usable on the frontend (e.g. query params, filters)
- **Shared hooks/utils** – pure utilities with no dependency on a specific domain
- **Transaction context** – default transaction settings (expires, extend)
- **Upload / S3** – shared upload configuration (CDN, bucket) – when used on the frontend

## Rules (critical)

Same dependency rules as server: domain boundaries and package usage must be respected. `@common` is the foundation layer; it must not depend on other app domains or on role-specific packages.

### Imports from other app domains

- **May import from**: none. Must not import from any other app domain (`@public`, `@session`, `@user`, `@buyer-session`, `@seller-session`, `@buyer-user`, `@seller-user`).
- **Used by**: any domain may import from `@common`.

### SDK import rules

SDK is organized by the same domains as the server (and UI). Same rules as domain imports above.

- **May use SDK for**: none. `@common` must not call API (no domain surface in shared layer).
- **Must not use SDK for**: any domain (buyer-user, buyer-session, seller-user, seller-session, session, user, public).

### Context

- **No own API/routes** – this domain does not expose HTTP.
- Foundation layer – all domains may depend on it.

### Security

Common resources are "open" in the sense that **any** domain may use them, including `@public` and `@session`. When adding or changing things in `@common`, take care not to leak sensitive or user-scoped data: nothing in `@common` may bypass domain-level access checks or expose data outside the intended scope.

## Use Cases

- Shared Effect/React contexts and providers.
- Common types and validation schemas.
- Utility functions used across domains.
- Business logic that does not belong to a single domain.

## Related Domains

- All domains may import from `@common`.
- `@buyer-user` / `@seller-user` – use transaction context and shared types.
- `@session` – may use common utilities.
- `@public` – may use common utilities (with care for sensitive data).

## Adding New Resources

When adding to `@common`:
1. Ensure the resource is truly shared across multiple domains.
2. Avoid domain-specific logic – keep it generic.
3. Document the resource in this README.
4. Consider whether it should live in a domain package (`@zbav-se.me/buyer`, `@zbav-se.me/seller`, …) instead.
