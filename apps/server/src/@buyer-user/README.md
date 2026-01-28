# @buyer-user

Buyer User API - Private API for buyer operations requiring access to user's private data.

## Overview

This domain handles all buyer-specific operations that require access to the user's private data context. These endpoints manage personal buyer features like saved feeds, favourites, ignored listings, and buyer-side transaction management.

## What's Here

### Feed Management
- **Collection** - List user's saved feeds
- **Create** - Create new feed with filters (category, location, radius, price, etc.)
- **Fetch** - Get single feed details
- **Patch** - Update feed settings
- **Delete** - Remove feed
- **Resolve** - Resolve feed filters into query parameters

### Favourites
- **Collection** - List favourite categories
- **Create/Delete** - Add/remove favourite categories
- **Toggle** - Quick toggle favourite status
- **Count** - Count favourites

### Feed Favourites
- **Collection** - Get favourite categories with listing counts per feed

### Feed Gallery
- **Create** - Create gallery for feed (saved search results)

### Ignore
- **Collection** - List ignored listings
- **Toggle** - Ignore/unignore a listing
- **Count** - Count ignored listings
- Personal cleanup feature - hides listings from feeds but doesn't block detail access

### Flag
- **Toggle** - Report problematic listing
- Available only from listing detail
- No automatic effects, metrics only

### Thumb (Like/Dislike)
- **Create** - Rate listing with like/dislike
- Used for metrics and personal preference tracking

### Transaction Management
- **Collection** - List buyer's transactions
- **Create** - Start new transaction (express interest in listing)
- **Fetch** - Get transaction details
- **Patch** - Update transaction
- **Resolve** - Resolve transaction context
- **Status Gate** - Check transaction status permissions

### Transaction Status
- Buyer-side transaction status operations

### User Events
- **Buyer Info** - Calculate buyer metrics (activity, closer rate, decision rate, reaction time, score, etc.)
- Aggregates user events for buyer reputation and behavior analysis

## Access Rules

- Requires authentication AND user context
- All operations are user-private
- Must use `{scope: {userId}}` when available
- **Can import from**: `@common`, `@session`, `@buyer-session`, `@user`
- **Cannot import from**: `@seller-user`, `@seller-session` (different domain), `@buyer-user` (self)
- This is the most specialized buyer domain - can access all buyer-related and general user resources

## Use Cases

- Managing saved searches (feeds)
- Tracking favourite categories
- Ignoring unwanted listings
- Rating listings (thumbs)
- Starting and managing purchase transactions
- Viewing buyer metrics and reputation

## Related Domains

- `@common` - Can import shared utilities
- `@session` - Can import from here (general session operations)
- `@buyer-session` - Can import from here (buyer session operations)
- `@user` - Can import from here (cross-domain user operations)
- This is the most specialized buyer domain
