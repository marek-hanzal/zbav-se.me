# @seller-user

Seller User API - Private API for seller operations requiring access to user's private data.

## Overview

This domain handles all seller-specific operations that require access to the user's private data context. These endpoints manage seller features like draft management, listing creation, and seller-side transaction handling.

## What's Here

### Draft Management
- **Collection** - List user's drafts (work-in-progress listings)
- **Create** - Create new draft
- **Fetch** - Get single draft details
- **Patch** - Update draft (autosave)
- **Delete** - Remove draft
- **Resolve** - Resolve draft into listing (publish)

### Draft Gallery
- **Create** - Add photos to draft gallery
- Manages photo uploads for draft listings

### Listing Creation
- **Create** - Publish draft as live listing
- Validates draft completeness and creates listing from draft

### Transaction Management
- **Collection** - List seller's transactions (incoming buyer requests)
- **Fetch** - Get transaction details
- Seller-side view of transactions on their listings
- Query performance: seller transaction filtering uses the joined listing owner (`l.userId`) and latest status lateral join (`status.latestStatus`) instead of nested `EXISTS` subqueries.

### Transaction Listing
- **Collection** - Get listings associated with transactions
- Links transactions to their source listings

### Transaction Status
- **Accept** - Accept buyer's interest (pending → open)
- **Resolve** - Mark transaction as resolved (listing → sold)
- Seller-side transaction state management

### User Events
- **Seller Info** - Calculate seller metrics (activity, reaction time, rejection rate, resolved rate, load, score, etc.)
- Aggregates user events for seller reputation and behavior analysis

## Access Rules

- Requires authentication AND user context
- All operations are user-private
- Must use `{scope: {userId}}` when available
- **Can import from**: `@common`, `@session`, `@seller-session`, `@user`
- **Cannot import from**: `@buyer-user`, `@buyer-session` (different domain), `@seller-user` (self)
- This is the most specialized seller domain - can access all seller-related and general user resources

## Use Cases

- Creating and editing listing drafts
- Publishing listings from drafts
- Managing incoming buyer requests
- Accepting/rejecting transactions
- Resolving completed sales
- Viewing seller metrics and reputation

## Related Domains

- `@common` - Can import shared utilities
- `@session` - Can import from here (general session operations)
- `@seller-session` - Can import from here (seller session operations)
- `@user` - Can import from here (cross-domain user operations)
- This is the most specialized seller domain
