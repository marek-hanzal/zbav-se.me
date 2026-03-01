# @seller-session

Seller Session – seller operations requiring session, working with public (protected) data.

## Overview

This domain contains components and logic for seller operations that **do not require user-private context**: displaying seller info on a listing, seller user events (metrics).

Maps to server API: `/api/seller-session/*`.

## What's Here (scope)

- **Listing / Seller Info** – seller information on a listing (for buyers)
- **User Event (seller)** – seller metrics (activity, reaction, rejection rate, resolved rate, load, score)

## Rules (critical)

Same dependency rules as server: domain boundaries and package usage must be respected.

### Imports from other app domains

- **May import from**: `@common`, `@session`.
- **Must not import from**: `@user`, `@seller-user`, `@buyer-user`, `@buyer-session`, `@seller-session` (self), `@public`.

### SDK import rules

SDK is organized by the same domains as the server (and UI). Same rules as domain imports above.

- **May use SDK for**: `session`, `seller-session` (i.e. `/api/session/*`, `/api/seller-session/*`).
- **Must not use SDK for**: `seller-user`, `user`, `buyer-user`, `buyer-session`, `public` (more specialized, different, or unauthenticated domain).

### Context

- **Requires**: authentication (session). Data is "public in protected space".
- **Does not have**: access to user-private data (that belongs in `@seller-user`).
- **Used by**: `@seller-user` (more specialized domain).

## Use Cases

- Displaying seller info on a listing card.
- Displaying seller metrics (score, reaction time) for buyers.

## Related Domains

- `@common` – shared utilities.
- `@session` – general session operations.
- `@seller-user` – uses this domain for seller info.
- `@public` – unauthenticated access.

## Recent updates

- Buyer info UI in transaction detail was normalized and extracted from `v0`:
  - `@seller-session/transaction/ui/BuyerInfoButton.tsx`
  - `@seller-session/transaction/ui/BuyerInfo/BuyerInfo.tsx` composes local suspense fallback for call-sites.
  - `@seller-session/transaction/ui/BuyerInfo/Data.tsx` keeps query/loading composition.
  - `@seller-session/transaction/ui/BuyerInfo/Events.tsx` renders behavior metrics.
  - `@seller-session/transaction/ui/BuyerInfo/Score.tsx` renders score/rank presentation.
- Buyer info metrics components now resolve locale via `useLocale()` instead of accepting `locale` props.
