# @session

Session API - Endpoints requiring authentication but operating on publicly accessible data.

## Overview

This domain provides endpoints that require a session (authenticated user) but work with data that is considered "public in a protected space". Any authenticated user can access resources in this domain freely, though the data may be user-related.

## What's Here

### Category Management
- **Collection** - List categories with filters and sorting
- **Count** - Count categories matching query
- **Fetch** - Get single category details
- Category taxonomy for listings

### Category Miss
- **Create** - Report missing category (user feedback)
- Allows users to suggest new categories

### Location Services
- **Autocomplete** - Location autocomplete/search
- **Fetch** - Get location details
- **List** - List locations with filters
- Geocoding and location management
- Context layer for location operations

### Transaction Operations
- Session-level helpers can participate in the transaction state machine
- Status authority lives directly on `transaction.status` and `transaction.statusUpdatedAt`
- Buyer/seller APIs expose concrete transaction actions such as accept, reject, resolve, success, close, and dispute

### Upload Management
- **Fetch** - Get upload details
- File metadata and access

### S3 Operations
- **Pre-sign** - Generate pre-signed URLs for S3 uploads
- Context layer for S3 client operations

## Access Rules

- Requires authentication (session)
- Data is "privately open" - any authenticated user can access
- May return user-related data, but it's considered public in protected space
- Runtime logging / tracing hooks are intentionally kept out of session handlers and effects
- **Can be accessed by**: Any domain with session (`@buyer-session`, `@seller-session`, `@buyer-user`, `@seller-user`, `@user`)
- **Cannot be accessed by**: `@public` (no session)
- **Can import from**: `@common` only
- **Cannot import from**: `@user`, `@buyer-user`, `@seller-user` (these are more specialized)

## Use Cases

- Browsing categories and locations
- Participating in transaction state transitions
- Getting upload metadata
- Generating S3 upload URLs
- Reporting missing categories

## Related Domains

- `@common` - Can import shared utilities
- `@buyer-session` / `@seller-session` - Can access this domain
- `@buyer-user` / `@seller-user` - Can access this domain
- `@user` - Can access this domain (but cannot import from `@user`)
- `@public` - Cannot access (no session)
