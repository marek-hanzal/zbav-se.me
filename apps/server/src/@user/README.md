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
  - **Gallery fetch** - Get gallery content for one gallery entry after transaction participation is validated
  - **Create** - Create one user-authored typed transaction entry
- Transaction entry contracts are discriminated by root `kind`, not by payload-only unions
- **Transaction Entry Kinds**:
  - `text` - Text timeline entries
  - `gallery` - Photo attachments
  - `location` - Location sharing
  - `package` - Package/tracking info
  - `personal` - Personal contact info
  - `status-*` - System/status timeline entries
- Public `/transaction-entry/create` accepts only the user-authored kinds above; `status-*` entries are internal-only

### Inbox
- **Collection** - List inbox items with query/filter/sort/cursor
- **Fetch** - Resolve one inbox item
- **Count** - Count inbox items for active/archived sections
- **Patch** - Mark one inbox item as archived/read
- **Patch Collection** - Patch multiple inbox items resolved by one `InboxQuery`
- **Archive** - Bulk archive selected items using `InboxQuery`
- Inbox contracts are discriminated by root `type`, not by payload-only unions
- Inbox is the source of truth for unread state, badge counts, grouped unread counts by `reference`, and similar "needs attention" signals across the app.
- Features must derive unread/badge behavior from Inbox instead of inventing parallel counters or transaction-status heuristics.
- Family:
  - `transaction`
  - `reaction`
- Types:
  - `buyer-message`
  - `seller-message`
  - `transaction`
  - `system`
  - `unknown`
  - `thumb`
  - `favourite`
  - `unfavourite`
- Transaction-like inbox payloads (`transaction`, `system`, `unknown`) carry `transactionId`, `listingId`, and recipient `target` so the app can deep-link into the correct buyer/seller transaction detail route.
- Inbox rows can store optional normalized `reference` metadata as `string[]`.
- Reference rules:
  - reaction-family rows store the related listing reference only: `[listingId]`
  - transaction-family rows store both listing and transaction references: `[listingId, transactionId]`
  - `where.reference` means "reference array contains this value"
  - `where.referenceIn` means "reference array overlaps any of these values"
- Inbox collection/count coalesces `buyer-message` and `seller-message` rows by `payload.transactionId`, but only after query filters/scope are applied, and then keeps the newest inbox row for each surviving thread.
- Owner-scoped `@user/gallery/*` fetches must not be reused for transaction conversation rendering; timeline gallery access goes through `@user/transaction-entry/gallery/fetch`, which validates transaction participation first and only then returns the linked gallery.

### Transaction Timeline
- Transaction communication now enters through the unified **Transaction Entry** API.
- Transaction-scoped write rules still apply:
  - `pending` blocks user-authored writes
  - `open` and `dispute` allow typed entry creation for both sides, with `package` still seller-only
- `resolved` keeps chat open only for buyer `text`, but blocks seller replies and the richer structured entry kinds

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
