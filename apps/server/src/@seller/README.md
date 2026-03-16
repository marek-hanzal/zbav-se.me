# @seller

Seller API - consolidated authenticated seller domain.

## Overview

This domain unifies former seller session and seller user capabilities behind `/api/seller/*`.

## What's Here

### Drafts and Listing Management
- **Draft** - Collection/count/create/fetch/patch/delete
  - Draft create can already initialize fields like `delivery`; patching is optional for progressive editing.
- **Draft Gallery** - Create
- **Listing** - Collection/count/create/fetch
  - Collection/fetch select only response fields from `listing`; internal columns like `userId` and
    `titleVec` stay off the wire and out of row materialization.

### Transactions
- **Transaction** - Collection/count/fetch/accept/dispute/reject/resolve
- **Transaction Buyer Info** - Buyer info lookup for a transaction
- **Transaction Listing** - Collection/count/fetch listing aggregates
- Status authority now lives directly on `transaction.status` with `transaction.statusUpdatedAt`,
  so seller transaction collection/count queries read current status without a separate status history table.
- Seller transaction status actions append shared status/system timeline entries through the user transaction helpers.
- Seller `transaction-listing` aggregates now carry the latest activity timestamp/kind/text for each listing row.
- Seller `transaction-listing` unread counts are derived from unread Inbox `buyer-message` rows by checking whether the inbox `reference[]` contains the listing id.
- Seller `transaction-listing` collection filters can now distinguish listings whose every child transaction is already terminal versus listings that still have at least one non-terminal transaction, using real `transaction.status` checks in SQL rather than synthetic aggregate payload fields.
- Seller transaction collection/fetch now also exposes unread Inbox `buyer-message` counts per transaction via the same `reference[]` containment rule.
- Seller transaction collection filters also support inbox-driven `active` plus real-status `terminal` filtering, matching the same transaction-level slicing contract we want to reuse for buyer.
- Seller transaction collection sort now also supports `lastAt`, aligned with the latest transaction-entry activity timestamp exposed on transaction payloads.
- Seller-side attention/badge signals must stay aligned with Inbox as the unread source of truth rather than inventing separate unread counters inside transaction aggregates.

## Access Rules

- Requires authentication.
- Mounted at `/api/seller/*`.
- Can import from: `@common`, `@session`, `@user`.
- Must not import from buyer domains.
- Runtime logging / tracing hooks are intentionally kept out of seller handlers and effects.

## Related Domains

- `@session` - shared authenticated utilities.
- `@user` - user-private shared primitives.
- `@public` - unauthenticated public API.
