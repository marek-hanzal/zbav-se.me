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
- **Can be accessed by**: `@seller-user` (more specialized)
- **Can import from**: `@common`, `@session`
- **Cannot import from**: `@user`, `@seller-user` (more specialized domains)

## Use Cases

- Viewing seller information on listings
- Getting seller profile data for buyer's transaction view

## Related Domains

- `@common` - Can import shared utilities
- `@session` - Can import from here (general session operations)
- `@seller-user` - Can access this domain (more specialized)
- `@public` - Unauthenticated access
