# @user

User – private user data (gallery, messages, uploads, user events, extended data).

## Overview

This domain contains components and logic for **user-private data**: galleries, messages, uploads, user events, extended profile data. Everything requires explicit user context.

Maps to server API: `/api/user/*`.

## What's Here (scope)

- **Gallery** – list galleries, fetch, create; photos for listings and messages
- **Gallery Items** – items in gallery (photos), count, create, fetch
- **Message** – conversation threads, messages in thread; types: text, gallery, location, package, personal, system
- **Transaction Messages** – messages in transaction (text, gallery, location, package, personal)
- **Transaction Status** – user-level transaction status operations
- **Upload** – list uploads, create, fetch; file metadata and lifecycle
- **User Events** – query user events, create, interaction event; metrics (activity, karma, XP, score)
- **User Extended Data** – fetch/patch extended user data, preferences, settings
- **S3** – pre-sign URLs for user uploads

## Rules (critical)

Same dependency rules as server: domain boundaries and package usage must be respected.

### Imports from other app domains

- **May import from**: `@common`, `@session`.
- **Must not import from**: `@buyer-user`, `@seller-user`, `@buyer-session`, `@seller-session`, `@user` (self), `@public`.

### SDK import rules

SDK is organized by the same domains as the server (and UI). Same rules as domain imports above.

- **May use SDK for**: `session`, `user` (i.e. `/api/session/*`, `/api/user/*`).
- **Must not use SDK for**: `buyer-user`, `buyer-session`, `seller-user`, `seller-session`, `public` (role-specific or unauthenticated domain).

### Context

- **Requires**: authentication + user context (user-private).
- **Used by**: only more specialized domains (`@buyer-user`, `@seller-user`).
- **Cannot be used by**: `@session`, `@buyer-session`, `@seller-session` (less specialized).

## Use Cases

- Managing personal galleries and photos.
- Sending and receiving messages.
- Managing transaction communications.
- Tracking user activity and events.
- Managing file uploads.
- Storing user preferences.

## Related Domains

- `@common` – shared utilities.
- `@session` – public authenticated data.
- `@buyer-user` / `@seller-user` – may use this domain.
- `@buyer-session` / `@seller-session` – cannot use this domain.
- `@user` is the foundation for all user-private data.

## Recent updates

- Home menu module (`@user/home/*`) was promoted from `@user/v0` to active app scope (`src/app/@user/home/*`) as the first extracted reference block.
- Home menu keeps its original inline implementation in `@user/home/HomeMenu.tsx` until we define a type-safe split strategy for TanStack Router links.
- Home menu uses local suspense for the draft CTA (`HomeMenuDraftLink`) with in-place fallback (`HomeMenuDraftLinkPending`) to preserve stable menu layout.
- Home draft CTA suspense is now encapsulated in `@user/home/HomeMenu/HomeMenuDraftLinkSuspense.tsx` so menu call-sites avoid inline suspense wiring.
- User-facing flow/shell routes now use page components:
  - `@user/home/page/HomePage.tsx`
  - `@user/profile/page/UserPage.tsx`
  - `@user/profile/page/UserPendingPage.tsx`
  - `@user/shop/page/ShopPage.tsx`
  - `@user/welcome/page/WelcomePage.tsx`
