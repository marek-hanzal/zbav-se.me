# @common

Common domain - Shared resources and utilities used across multiple domains.

## Overview

This domain provides shared resources, contexts, and utilities that are used by multiple other domains. Unlike other domains, `@common` does not expose its own API endpoints. It serves as a source of shared functionality that can be imported by any domain.

## Purpose

The `@common` domain exists to:
- Prevent code duplication across domains
- Provide shared contexts and configuration
- Centralize common business logic that spans multiple domains
- Maintain consistency across domain boundaries

## What's Here

### Transaction Context
- **TransactionContextFx** - Effect context for transaction configuration
- **DefaultTransactionContext** - Default transaction settings (expires: 3 days, extend: 3 days)
- **TransactionContextProvider** - Effect provider for transaction context
- Used across `@buyer-user`, `@seller-user`, `@user`, and `@public` domains

### Transaction Status Schemas
- Used in `@user` and `@session` domains for transaction status operations

### S3 Operations
- **S3ContextFx** - Effect context for S3 configuration (API endpoint, credentials, bucket)
- **S3ContextLayer** - Effect layer provider for S3 context
- **S3ContextLayerFx** - Effect layer factory for S3 context
- **s3ClientFx** - Effect function to create MinIO S3 client
- **s3PreSignFx** - Effect function to generate pre-signed URLs for S3 uploads
- Used in `@user` and `@public` domains for file upload operations

### Upload Context
- **UploadContextFx** - Effect context for upload configuration (CDN base URL)
- **UploadContextLayer** - Effect layer provider for upload context
- **UploadContextLayerFx** - Effect layer factory for upload context
- Used in `@user` domain for upload operations and S3 pre-signing

### User Event
- **UserEventEnumSchema** - Zod schema for user event types (like, dislike, listing.create, transaction.* events)
- **UserEventSourceEnumSchema** - Zod schema for user event source types (listing, transaction)
- **UserEventFilterSchema**, **UserEventSortSchema**, **UserEventWhereSchema**, **UserEventQuerySchema** - Query/filter/sort schemas for the `user_event` table
- **withUserEventSourceSelectFx**, **withUserEventQueryBuilderFx**, **withUserEventCollectionSelectFx** - ˛Kysely query builders for `user_event`
- **userEventCollectionFx** - Effect function for paginated user event collection
- Used in `@buyer-session` (userEventBuyerInfoFx), `@seller-session` (userEventSellerInfoFx), and `@user` domain for user event operations and database table schemas

### Listing Schema
- **ProsConsSchema** - Zod schema for pros/cons arrays (max 5 items, each string max 72 characters)
- **ListingExpireEnumSchema** - Zod schema for listing expiration times (7-days, 14-days, 1-month)
- Used in `@seller-user` domain for listing and draft creation, and in database table schemas

## Access Rules

- **No API endpoints** - This domain does not expose HTTP routes
- **Completely open** - Can be imported by any domain (`@public`, `@session`, `@user`, `@buyer-session`, `@seller-session`, `@buyer-user`, `@seller-user`)
- **Should not import from other domains** - To avoid circular dependencies
- Focus on pure utilities, contexts, and shared types
- This is the foundation layer - all domains can depend on it

## Use Cases

- Shared Effect contexts and providers
- Common configuration objects
- Shared type definitions
- Utility functions used across domains
- Business logic that doesn't belong to a specific domain

## Related Domains

- `@buyer-session` - Uses user-event query infrastructure (userEventCollectionFx) for buyer info
- `@seller-session` - Uses user-event query infrastructure (userEventCollectionFx) for seller info
- `@buyer-user` - Uses transaction context
- `@seller-user` - Uses transaction context
- `@user` - Uses transaction context, user-event schemas
- `@session` - May use common utilities
- `@public` - May use common utilities

## Adding New Common Resources

When adding new resources to `@common`:
1. Ensure the resource is truly shared across multiple domains
2. Avoid domain-specific logic - keep it generic
3. Document the resource in this README
4. Consider if it might belong in a domain-specific package instead
