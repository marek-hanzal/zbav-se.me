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

### Transaction Status Operations
- **Create** - Create transaction status event
- **Accept** - Accept transaction (pending → open)
- **Reject** - Reject transaction
- **Resolve** - Resolve transaction (seller marks resolved)
- **Success** - Mark transaction as successful
- **Close** - Close transaction
- **Dispute** - Open dispute
- **Fetch** - Get transaction status
- Core transaction state machine operations

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
- **Cannot import from `@user` domain** (critical rule)

## Use Cases

- Browsing categories and locations
- Managing transaction status (core operations)
- Getting upload metadata
- Generating S3 upload URLs
- Reporting missing categories

## Related Domains

- `@user` - Private user data (cannot import from here)
- `@buyer-session` / `@seller-session` - Domain-specific session operations
- `@public` - Unauthenticated access
