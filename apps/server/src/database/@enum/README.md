# @enum

Database enum schemas - Zod schemas for all PostgreSQL enum types used in the database.

## Overview

This directory contains Zod schemas that correspond to PostgreSQL enum types defined in database migrations. These enums are part of the database schema and are used across the application for type-safe enum handling.

## Purpose

Database enums are defined in migrations and represent fixed sets of values stored in PostgreSQL. The Zod schemas in this directory:
- Provide type-safe validation for enum values
- Generate OpenAPI documentation
- Ensure consistency between database schema and application code
- Serve as the single source of truth for enum values

## What's Here

All enum schemas correspond to PostgreSQL enum types created in migrations:

### Listing Enums
- **ListingPriceEnumSchema** - Price type (`closed`, `open`)
- **ListingDeliveryEnumSchema** - Delivery method (`personal`, `post`, `package`, `other`)
- **ListingWarrantyEnumSchema** - Warranty type (`warranty`, `no-warranty`, `custom`)
- **ListingRestrictionEnumSchema** - Content restriction level (`none`, `adult`, `adult-relaxed`, `sensitive`, `restricted`)
- **ListingEventEnumSchema** - Listing event types (`impression`, `view`, `ignore`, `unignore`, `flag`, `unflag`, `transaction`, `favourite`, `unfavourite`, `like`, `dislike`)

### Transaction Enums
- **TransactionStatusEnumSchema** - Transaction status (`pending`, `open`, `resolved`, `dispute`, `rejected`, `expired`, `success`, `closed`)
- **TransactionSideEnumSchema** - Transaction side/initiator (`seller`, `buyer`, `transaction`, `system`, `unknown`)

### User Enums
- **UserSideEnumSchema** - User side (`seller`, `buyer`)
- **UserEventScopeEnumSchema** - User event scope (`user`, `foreign`)

### Thumb Enum
- **ThumbEnumSchema** - Thumb type (`like`, `dislike`)

### Feed Enum
- **FeedTypeEnumSchema** - Feed type (`user`, `search`)

### Inbox Enums
- **InboxPriorityEnumSchema** - Inbox priority (`common`, `high`)
- **InboxTypeEnumSchema** - Inbox type (`seller-message`, `buyer-message`, `thumb`)

## Usage

Import enum schemas from this directory:

```typescript
import { TransactionStatusEnumSchema } from "~/database/@enum/TransactionStatusEnumSchema";
```

Use in Zod schemas:

```typescript
const schema = z.object({
  status: TransactionStatusEnumSchema,
});
```

## Migration Correspondence

Each enum schema corresponds to a PostgreSQL enum type created in migrations:
- `listing_price_enum` → `ListingPriceEnumSchema`
- `listing_delivery_enum` → `ListingDeliveryEnumSchema`
- `listing_warranty_enum` → `ListingWarrantyEnumSchema`
- `listing_restriction_enum` → `ListingRestrictionEnumSchema`
- `listing_event_type_enum` → `ListingEventEnumSchema`
- `transaction_status_enum` → `TransactionStatusEnumSchema`
- `transaction_side_enum` → `TransactionSideEnumSchema`
- `user_ex_side_enum` → `UserSideEnumSchema`
- `user_event_scope_enum` → `UserEventScopeEnumSchema`
- `thumb_enum` → `ThumbEnumSchema`
- `feed_type_enum` → `FeedTypeEnumSchema`
- `inbox_priority_enum` → `InboxPriorityEnumSchema`
- `inbox_type_enum` → `InboxTypeEnumSchema`

## Adding New Enums

When adding a new enum to the database:
1. Create the enum type in a migration using `createType().asEnum()`
2. Create a corresponding Zod schema in this directory
3. Use the same values in both the migration and the schema
4. Update this README with the new enum

## Related Directories

- `database/@table/` - Table schemas that use these enums
- `database/migrations/` - Where enum types are defined in PostgreSQL
