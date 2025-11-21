# @zbav-se.me/common

> Shared business logic and utilities for the zbav-se.me project

## Overview

This package contains **general-purpose business logic, utilities, and components** that are shared across the zbav-se.me ecosystem but are **not specific to the buyer or seller domains**. This serves as the home for cross-cutting concerns, shared domain logic, and reusable business functionality that applies to multiple parts of the application.

## Purpose

The main goals of this package are to:

- **Provide domain-agnostic business logic** that spans across buyer and seller contexts
- **House shared utilities and helpers** used throughout the application
- **Define common types and schemas** that are used across multiple domains
- **Centralize cross-cutting concerns** like validation, formatting, and data transformation
- **Reduce duplication** of business logic across domain-specific packages
- **Enable consistency** in how common business rules are applied

## What Belongs Here?

### ✅ DO Include

Components and logic that are:
- **Cross-domain business logic** - Rules that apply to both buyers and sellers
- **Shared data models** - Types, schemas, and interfaces used across domains
- **Common validation logic** - Schema validation, input sanitization
- **Utility functions** - Date formatting, string manipulation, calculations
- **Shared constants** - Enums, configuration values, magic numbers
- **Helper functions** - Generic business logic helpers
- **Common hooks** - Reusable logic that applies across domains
- **Data transformation** - Mappers, converters, normalizers

**Examples:**
- Price formatting utilities
- Date/time calculations and formatting
- Listing status validation
- Transaction state logic
- Common validation schemas (Zod)
- Geographic/location utilities
- Age range or condition mappings
- Rating/score calculations

### ❌ DON'T Include

Logic that should go elsewhere:
- **Buyer-specific logic** → Use `@zbav-se.me/buyer` package
- **Seller-specific logic** → Use `@zbav-se.me/seller` package
- **Pure UI components** → Use `@zbav-se.me/ui` package
- **API implementations** → Belongs in app/server code
- **App-specific routing** → Belongs in individual apps

## Package Structure

This package follows a simple, flat structure:

```
src/
├── index.ts          # Main export file
└── [modules]/        # Feature-based modules (to be added as needed)
```

As the application grows, this package will be organized into feature-based modules:
- `validation/` - Shared validation schemas and rules
- `formatting/` - Data formatting utilities
- `types/` - Common TypeScript types and interfaces
- `constants/` - Shared constants and enums
- `utils/` - General utility functions
- `hooks/` - Shared React hooks with business logic

## Technology Stack

- **TypeScript 5.9** - Type safety and modern JavaScript features
- **Zod 4.1** - Schema validation and type inference

## Usage

Import shared utilities and logic from this package:

```typescript
import { formatPrice, validateListing } from "@zbav-se.me/common";
import { ListingStatus, TransactionState } from "@zbav-se.me/common";

// Use shared business logic
const displayPrice = formatPrice(1234.56, 'CZK');
const isValid = validateListing(listingData);
```

## Guidelines for Contributors

### When to Add Code Here

Ask yourself these questions:

1. **Is this used by both buyers and sellers?** → Add here
2. **Is this pure business logic without UI?** → Probably add here
3. **Is this a shared type or schema?** → Add here
4. **Is this a utility function used in multiple domains?** → Add here

### When to Add Code Elsewhere

1. **Is this specific to buyers or sellers?** → Use `@zbav-se.me/buyer` or `@zbav-se.me/seller`
2. **Is this a UI component?** → Use `@zbav-se.me/ui`
3. **Is this API/server logic?** → Keep in server package
4. **Is this app-specific?** → Keep in the specific app

## Examples

### ✅ Good Examples (Belongs Here)

```typescript
// Shared validation schema
export const ListingPriceSchema = z.object({
  amount: z.number().positive().max(1000000),
  currency: z.enum(['CZK', 'EUR'])
});

// Common utility function
export const formatCurrency = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('cs-CZ', { 
    style: 'currency', 
    currency 
  }).format(amount);
};

// Shared type
export type ListingStatus = 'draft' | 'active' | 'sold' | 'expired';

// Business logic helper
export const isListingExpired = (expiresAt: Date): boolean => {
  return new Date() > expiresAt;
};
```

### ❌ Bad Examples (Doesn't Belong Here)

```typescript
// ❌ Buyer-specific logic - belongs in @zbav-se.me/buyer
export const addToCart = (listingId: string) => { ... };

// ❌ UI component - belongs in @zbav-se.me/ui
export const Button = ({ children }: Props) => { ... };

// ❌ API call - belongs in app/server
export const fetchListings = async () => { ... };
```

## Development

```bash
# Type checking
bun run typecheck
```

## Related Packages

- `@zbav-se.me/ui` - Pure UI components (no business logic)
- `@zbav-se.me/buyer` - Buyer-specific business logic and features
- `@zbav-se.me/seller` - Seller-specific business logic and features
- `@zbav-se.me/sdk` - Generated API client
- `@use-pico/common` - Framework-level utilities

## Architecture Principles

This package follows these principles:

1. **Domain Independence** - Code here should not favor buyers or sellers
2. **Business Logic Focus** - This is not for UI components or API calls
3. **Reusability** - Everything here should be used in multiple places
4. **Type Safety** - Leverage TypeScript and Zod for runtime validation
5. **Simplicity** - Keep utilities focused and composable

---

**Note**: This package is part of the zbav-se.me monorepo and bridges the gap between pure UI components (`@zbav-se.me/ui`) and domain-specific logic (`@zbav-se.me/buyer`, `@zbav-se.me/seller`).
