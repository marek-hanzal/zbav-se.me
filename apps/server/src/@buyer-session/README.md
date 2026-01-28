# @buyer-session

Buyer Session API - Open API for buyer operations that require authentication but work with public data.

## Overview

This domain provides buyer-specific endpoints that require a session (authenticated user) but operate on publicly accessible data. Unlike `@buyer-user`, these endpoints don't require access to the user's private data context.

## What's Here

### Listing Operations
- **Collection** - Browse and search listings with filters (category, location, price, condition, etc.)
- **Count** - Get count of listings matching query
- **Fetch** - Get single listing by ID
- **Check Ownership** - Verify if listing belongs to current user

### Listing Events
- **Create** - Record events on listings (visible, impression, view, thumbs, ignored, transaction.created, etc.)
- **Collection** - Query listing events with rate limiting
- **Count** - Count events for listings

### Transaction Info
- **Buyer Info** - Get buyer information for a transaction (for seller's view)

## Access Rules

- Requires authentication (session)
- Data is considered "public in protected space" - any authenticated user can access
- No user-private data operations (those belong in `@buyer-user`)
- **Can be accessed by**: `@buyer-user` (more specialized)
- **Can import from**: `@common`, `@session`
- **Cannot import from**: `@user`, `@buyer-user` (more specialized domains)

## Use Cases

- Browsing listings while logged in
- Recording listing interactions (views, impressions)
- Getting transaction participant info
- Checking listing ownership

## Related Domains

- `@common` - Can import shared utilities
- `@session` - Can import from here (general session operations)
- `@buyer-user` - Can access this domain (more specialized)
- `@public` - Unauthenticated listing access
