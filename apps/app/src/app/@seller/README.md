# @seller

Seller UI domain.

## Overview

Merged seller domain for both session-level and user-private seller features.

Maps to server API: `/api/seller/*`.

## Scope

- Seller draft and listing management.
- Seller transaction and transaction-status flows.
- Seller buyer-info/metrics UI in transaction context.

## Imports

- May import from: `@common`, `@session`, `@user`.
- Must not import from: buyer domains, `@public`, self.

## SDK

- May use: `seller`, `session`, `user`.
- Must not use: `buyer`, `public`.
