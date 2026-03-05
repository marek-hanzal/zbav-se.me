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

### Message System
- **Message Thread** - Conversation threads
  - **Collection** - List message threads
  - **Create** - Start new thread
  - **Fetch** - Get thread details
  - **Patch** - Update thread
- **Message** - Individual messages in threads
  - **Collection** - List messages in thread
- **Message Types**:
  - `message_text` - Text messages
  - `message_gallery` - Photo attachments
  - `message_location` - Location sharing
  - `message_package` - Package/tracking info
  - `message_personal` - Personal contact info
  - `message_system` - System notifications
- **Message Thread User** - Thread participants

### Inbox
- **Collection** - List inbox items with query/filter/sort/cursor
- **Fetch** - Resolve one inbox item
- **Count** - Count inbox items for active/archived sections
- **Patch** - Mark one inbox item as archived/read
- **Archive** - Bulk archive selected items using `InboxQuery`
- Types:
  - `seller-message`
  - `buyer-message`
  - `thumb`

### Transaction Messages
- Transaction-specific message types:
  - **Transaction Message Text** - Text in transaction
  - **Transaction Message Gallery** - Photos in transaction
  - **Transaction Message Location** - Meeting place
  - **Transaction Message Package** - Shipping info
  - **Transaction Message Personal** - Contact details

### Transaction Status
- User-level transaction status operations
- Cross-domain transaction state management
- Transaction status resolution reads latest rows by timestamp and uses deterministic ordering for tied timestamps.

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
- Sending and receiving messages
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
