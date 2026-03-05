# @buyer

Buyer API - consolidated authenticated buyer domain.

## Overview

This domain unifies former buyer session and buyer user capabilities behind `/api/buyer/*`.

## What's Here

### Listing Operations
- **Collection** - Browse and search listings
- **Count** - Count listings matching query
- **Fetch** - Get listing detail
- **Seller Info** - Get seller profile metrics for listing detail
- **Check Ownership** - Verify if listing belongs to current user
- Buyer listing `fetch` and `collection` endpoints are marked with OpenAPI tag `mcp` for MCP bridge exposure.

### Listing Events
- **Create** - Record listing interaction events

### Feed and Preferences
- **Feed** - Create/update/fetch/collection/count/delete
- **Feed Favourite** - Collection/fetch/count
- **Feed Gallery** - Create
- **Favourite** - Collection/count/toggle
- **Ignore** - Collection/count/toggle
- **Flag** - Collection/count/toggle
- **Thumb** - Create

### Transactions
- **Transaction** - Collection/count/create/fetch
- **Transaction Status** - close/dispute/reject/success

### User Events
- Buyer and seller scoring/behavior info used in buyer flows.

## Access Rules

- Requires authentication.
- Mounted at `/api/buyer/*`.
- Can import from: `@common`, `@session`, `@user`.
- Must not import from seller domains.

## Related Domains

- `@session` - shared authenticated utilities.
- `@user` - user-private shared primitives.
- `@public` - unauthenticated public API.

## Recent updates

- Geo listing sort now optimizes `geo desc` by converting it to equivalent antipode `geo asc` ordering so PostGIS KNN (`location_[geo]_idx`) can be used.
