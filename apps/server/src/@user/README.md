# @user


User API - Private user data operations requiring user context.

## Overview

This domain handles all operations on user-owned, private data. Everything in this domain is user-private and requires explicit user context. This is the core domain for personal data management across buyer and seller roles.

## What's Here

### Gallery Management
- **Collection** - List user's galleries
- **Fetch** - Get gallery details
- **Create** - Create new gallery
- Photo galleries for listings and messages

### Gallery Items
- **Collection** - List items in gallery
- **Count** - Count gallery items
- **Create** - Add item to gallery
- **Fetch** - Get gallery item
- Individual photos/images in galleries
  - Listing gallery payloads join `upload` directly and use a covering
    `gallery_item ("galleryId", "sort") INCLUDE ("id", "uploadId")` index to avoid nested upload lookups.

### Transaction Entry System
- **Transaction Entry** - Unified transaction timeline API
  - **Collection** - List transaction entries with query/filter/sort/cursor
  - **Count** - Count transaction entries for a query
  - **Fetch** - Get one transaction entry by query
  - **Create** - Create one user-authored typed transaction entry
- Transaction entry contracts are discriminated by root `kind`, not by payload-only unions
- **Transaction Entry Kinds**:
  - `text` - Text timeline entries
  - `gallery` - Photo attachments
  - `location` - Location sharing
  - `package` - Package/tracking info
  - `personal` - Personal contact info
  - `status-*` - System/status timeline entries

### Inbox
- **Collection** - List inbox items with query/filter/sort/cursor
- **Fetch** - Resolve one inbox item
- **Count** - Count inbox items for active/archived sections
- **Patch** - Mark one inbox item as archived/read
- **Archive** - Bulk archive selected items using `InboxQuery`
- Family:
  - `message`
  - `reaction`
- Types:
  - `seller-message`
  - `buyer-message`
  - `thumb`
  - `favourite`
  - `unfavourite`
- Local Docker Compose upgrade for existing databases:
  - Run `docker compose exec postgres psql -U postgres -d zbav_se_me -c 'ALTER TABLE "inbox" ADD COLUMN IF NOT EXISTS "family" text;'`
- Run `docker compose exec postgres psql -U postgres -d zbav_se_me -c "UPDATE \"inbox\" SET \"family\" = CASE WHEN \"type\" IN ('seller-message', 'buyer-message') THEN 'message' WHEN \"type\" IN ('thumb', 'favourite', 'unfavourite') THEN 'reaction' ELSE \"family\" END WHERE \"family\" IS NULL;"`
  - Run `docker compose exec postgres psql -U postgres -d zbav_se_me -c 'ALTER TABLE "inbox" ALTER COLUMN "family" SET NOT NULL;'`
  - Run `docker compose exec postgres psql -U postgres -d zbav_se_me -c 'CREATE INDEX IF NOT EXISTS "inbox_[userId-family]_idx" ON "inbox" ("userId", "family");'`

### Transaction Timeline
- Transaction communication now enters through the unified **Transaction Entry** API.
- Transaction-scoped write rules still apply:
  - `pending` blocks user-authored writes
  - `open` and `dispute` allow typed entry creation for both sides, with `package` still seller-only
  - `resolved` keeps chat open for `text`, but blocks the richer structured entry kinds

### Transaction State
- Shared transaction state helpers live under `@user/transaction`
- Status authority is stored directly on `transaction.status` and `transaction.statusUpdatedAt`
- `transactionTransitionFx` is the pure state-machine gate for both status transitions and transaction-entry write permissions
- `transactionUpdateStatusFx` applies validated status writes and runs terminal cleanup
- `transactionStatusMessageFx` is the shared source of truth for appending status/system timeline entries
- Buyer/seller domains trigger state changes through transaction-scoped actions, not a standalone status domain

### Upload Management
- **Collection** - List user's uploads
- **Create** - Create upload record
- **Fetch** - Get upload details
- File upload metadata and lifecycle
- Context layer for upload operations

### User Events
- **Collection** - Query user events
- **Create** - Record user event
- **Interaction Event** - Record user interaction
- Event tracking for metrics (activity, karma, XP, score, etc.)
- Scopes: `user`, `listing`, `transaction`

### User Extended Data
- **Fetch** - Get extended user data
- **Patch** - Update user extended data
- **Token Enable** - Generate and persist user token (`/api/user/token/enable`)
- **Token Disable** - Revoke user token by setting it to `null` (`/api/user/token/disable`)
- Additional user profile information
- User preferences and settings

### S3 Operations
- **Pre-sign** - Generate pre-signed URLs for user uploads
- User-specific S3 access

## Access Rules

- Requires authentication AND user context
- All endpoints must use `{scope: {userId}}` when available
- All data is user-private
- **Can be accessed by**: Only more specialized domains (`@buyer-user`, `@seller-user`)
- **Cannot be accessed by**: `@session`, `@buyer-session`, `@seller-session` (these are less specialized)
- **Can import from**: `@common`, `@session`
- **Cannot import from**: `@buyer-user`, `@seller-user`, `@buyer-session`, `@seller-session` (to avoid circular dependencies)

## Use Cases

- Managing personal galleries and photos
- Sending and receiving transaction timeline entries
- Managing transaction communications
- Tracking user activity and events
- Managing file uploads
- Storing user preferences

## Related Domains

- `@common` - Can import shared utilities
- `@session` - Can import from here (public authenticated data)
- `@buyer-user` / `@seller-user` - Can access this domain (more specialized)
- `@buyer-session` / `@seller-session` - Cannot access (less specialized)
- `@user` is the foundation for all user-private data
