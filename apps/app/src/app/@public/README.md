# @public

Public – unauthenticated pages and components (login, register, public content).

## Overview

This domain contains components and logic for **public access without login**: login, registration, public pages, health/origin, and optionally public listing preview. Most marketplace features require authentication; this domain is intentionally minimal.

Maps to server API: `/api/public/*` (auth, health, origin, …).

## What's Here (scope)

- **Auth** – login, register, sign out; Better Auth integration
- **Public pages** – public pages without session (landing, terms, …)
- **Origin / Health** – origin info, health check UI (if needed)
- **Public listing preview** – minimal public listing preview (if present)

## Rules (critical)

Same dependency rules as server: domain boundaries and package usage must be respected.

### Imports from other app domains

- **May import from**: `@common` only.
- **Must not import from**: `@session`, `@user`, `@buyer-session`, `@seller-session`, `@buyer-user`, `@seller-user`, `@public` (self).

### SDK import rules

SDK is organized by the same domains as the server (and UI). Same rules as domain imports above.

- **May use SDK for**: `public` only (i.e. `/api/public/*` – auth, health, origin, …).
- **Must not use SDK for**: `session`, `user`, `buyer-user`, `buyer-session`, `seller-user`, `seller-session` (authenticated domains).

### Context

- **Does not require**: authentication. Publicly accessible.
- **Used for**: first step when opening the app (login/register).

## Use Cases

- User registration and login.
- Public marketing / informational pages.
- Displaying health status (monitoring).
- Minimal public preview without session.

## Security

- Components in this domain must not display or pass sensitive/user data.
- Auth endpoints are public by design; the rest of the API remains protected.

## Related Domains

- `@common` – shared utilities.
- Other domains require authentication and cannot be imported.
- `@session` – first step after authentication.
- `@public` is the entry point for unauthenticated users.
