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

## Access Rules

- **No API endpoints** - This domain does not expose HTTP routes
- Can be imported by any domain (`@buyer-user`, `@seller-user`, `@user`, `@session`, `@public`)
- Should not import from other domains (to avoid circular dependencies)
- Focus on pure utilities, contexts, and shared types

## Use Cases

- Shared Effect contexts and providers
- Common configuration objects
- Shared type definitions
- Utility functions used across domains
- Business logic that doesn't belong to a specific domain

## Related Domains

- `@buyer-user` - Uses transaction context
- `@seller-user` - Uses transaction context
- `@user` - Uses transaction context
- `@session` - May use common utilities
- `@public` - May use common utilities

## Adding New Common Resources

When adding new resources to `@common`:
1. Ensure the resource is truly shared across multiple domains
2. Avoid domain-specific logic - keep it generic
3. Document the resource in this README
4. Consider if it might belong in a domain-specific package instead
