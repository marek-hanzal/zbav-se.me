# @session

Session – shared authenticated data and operations (categories, location, transaction-status, upload).

## Overview

This domain contains components and logic for **public data in protected space**: accessible to any authenticated user. Categories, locations, transaction status operations, upload metadata, S3 pre-sign.

Maps to server API: `/api/session/*`.

## What's Here (scope)

- **Category** – list categories, filters, sort, count, fetch; taxonomy for listings
- **Category Miss** – report missing category (feedback)
- **Location** – autocomplete, fetch, list locations; geocoding, location context
- **Transaction Status** – create, accept, reject, resolve, success, close, dispute, fetch; transaction state machine
- **Upload** – fetch upload metadata
- **S3** – pre-sign URLs for uploads; S3 client context

## Rules (critical)

Same dependency rules as server: domain boundaries and package usage must be respected.

### Imports from other app domains

- **May import from**: `@common` only.
- **Must not import from**: `@user`, `@buyer-user`, `@seller-user`, `@buyer-session`, `@seller-session`, `@session` (self), `@public`.

### SDK import rules

SDK is organized by the same domains as the server (and UI). Same rules as domain imports above.

- **May use SDK for**: `session` only (i.e. `/api/session/*`).
- **Must not use SDK for**: `buyer-user`, `buyer-session`, `seller-user`, `seller-session`, `user`, `public` (more specialized or unauthenticated domain).

### Context

- **Requires**: authentication (session). Data is "public in protected space".
- **Used by**: `@buyer-session`, `@seller-session`, `@buyer-user`, `@seller-user`, `@user`.
- **Cannot be used by**: `@public` (no session).

## Use Cases

- Browsing categories and locations.
- Managing transaction status (accept, reject, resolve, …).
- Getting upload metadata.
- Generating S3 upload URLs.
- Reporting missing category.

## Related Domains

- `@common` – shared utilities.
- `@buyer-session` / `@seller-session` – may use this domain.
- `@buyer-user` / `@seller-user` – may use this domain.
- `@user` – may use this domain.
- `@public` – no access (no session).

## Recent updates

- Category pending content now aligns with shared `ValueList.PropsEx` contract, allowing parent-provided labels/hints to override defaults without local prop reshaping.
- `CategorySelect` component moved to active scope at `@session/category/ui/CategorySelect/CategorySelect.tsx`; `v0` now re-exports it while retaining existing `v0` internals (`ListContainer`, pending states).
