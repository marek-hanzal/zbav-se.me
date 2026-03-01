# @buyer-session

Buyer Session – buyer operations requiring session, working with public (protected) data.

## Overview

This domain contains components and logic for buyer operations that **do not require user-private context**: browsing listings, recording listing events (views, impressions), and buyer info for a transaction (for seller view).

Maps to server API: `/api/buyer-session/*`.

## What's Here (scope)

- **Listing** – browse and search listings (collection, count, fetch), ownership check
- **Listing Event** – record interactions (visible, impression, view, thumbs, ignored, transaction.created)
- **Transaction Info** – buyer information for a transaction (for seller view)

## Rules (critical)

Same dependency rules as server: domain boundaries and package usage must be respected.

### Imports from other app domains

- **May import from**: `@common`, `@session`.
- **Must not import from**: `@user`, `@buyer-user`, `@seller-user`, `@seller-session`, `@buyer-session` (self), `@public`.

### SDK import rules

SDK is organized by the same domains as the server (and UI). Same rules as domain imports above.

- **May use SDK for**: `session`, `buyer-session` (i.e. `/api/session/*`, `/api/buyer-session/*`).
- **Must not use SDK for**: `buyer-user`, `user`, `seller-user`, `seller-session`, `public` (more specialized, different, or unauthenticated domain).

### Context

- **Requires**: authentication (session). Data is "public in protected space".
- **Does not have**: access to user-private data (that belongs in `@buyer-user`).
- **Used by**: `@buyer-user` (more specialized domain).

## Use Cases

- Browsing listings while logged in.
- Recording listing interactions (views, impressions).
- Getting transaction participant info.
- Checking listing ownership.

## Related Domains

- `@common` – shared utilities.
- `@session` – categories, location, transaction-status.
- `@buyer-user` – uses this domain for listing/events.
- `@public` – unauthenticated listing access.

## Recent updates

- `useListingEvent` hook was extracted from `v0` to active scope:
  - `@buyer-session/listing/hook/useListingEvent.ts`
- Seller info UI components were extracted from `v0` to active scope:
  - `@buyer-session/listing/ui/SellerInfoButton.tsx`
  - `@buyer-session/listing/ui/SellerInfo/SellerInfo.tsx`
  - `@buyer-session/listing/ui/SellerInfo/Data.tsx`
  - `@buyer-session/listing/ui/SellerInfo/Header.tsx`
  - `@buyer-session/listing/ui/SellerInfo/Score.tsx`
- Listing seller info components now resolve locale via `useLocale()` instead of accepting `locale` props.
