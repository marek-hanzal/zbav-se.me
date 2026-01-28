# @seller-session

Seller Session API - Open API for seller operations that require authentication but work with public data.

## Overview

This domain provides seller-specific endpoints that require a session (authenticated user) but operate on publicly accessible data. Unlike `@seller-user`, these endpoints don't require access to the user's private data context.

## What's Here

### Listing Operations
- **Seller Info** - Get seller information for a listing
- Public seller profile data visible to buyers

## Access Rules

- Requires authentication (session)
- Data is considered "public in protected space" - any authenticated user can access
- No user-private data operations (those belong in `@seller-user`)
- Cannot import from `@seller-user` or `@user` domains

## Use Cases

- Viewing seller information on listings
- Getting seller profile data for buyer's transaction view

## Related Domains

- `@seller-user` - Private seller operations (drafts, listings, transactions)
- `@session` - General session operations
- `@public` - Unauthenticated access
