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
- **Transaction** - Collection/count/fetch
- **Transaction Buyer Info** - Buyer info lookup for a transaction
- **Transaction Listing** - Collection/count/fetch listing aggregates
- **Transaction Status** - accept/dispute/reject/resolve
  - Latest-status lookups are backed by a covering `transaction_status` index on
    `("transactionId", "createdAt" DESC, "id" DESC) INCLUDE ("status")` to keep
    seller transaction collection/count queries off per-row re-sorts.

## Access Rules

- Requires authentication.
- Mounted at `/api/seller/*`.
- Can import from: `@common`, `@session`, `@user`.
- Must not import from buyer domains.

## Related Domains

- `@session` - shared authenticated utilities.
- `@user` - user-private shared primitives.
- `@public` - unauthenticated public API.
