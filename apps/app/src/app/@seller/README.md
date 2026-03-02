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

## Recent updates

- Draft editor localizes single-use read-only value components:
  - `@seller/draft/DraftEditPage/DraftEditor/value/CategoryValue.tsx`
  - `@seller/draft/DraftEditPage/DraftEditor/value/AgeValue.tsx`
  - `@seller/draft/DraftEditPage/DraftEditor/value/ConditionValue.tsx`
  - `@seller/draft/DraftEditPage/DraftEditor/value/ConsValueList.tsx`
  - `@seller/draft/DraftEditPage/DraftEditor/value/DescriptionValue.tsx`
  - `@seller/draft/DraftEditPage/DraftEditor/value/ExpireAtValue.tsx`
  - `@seller/draft/DraftEditPage/DraftEditor/value/PriceTypeValue.tsx`
  - `@seller/draft/DraftEditPage/DraftEditor/value/PriceValue.tsx`
  - `@seller/draft/DraftEditPage/DraftEditor/value/ProsValueList.tsx`
  - `@seller/draft/DraftEditPage/DraftEditor/value/RestrictionValue.tsx`
  - `@seller/draft/DraftEditPage/DraftEditor/value/WarrantyValue.tsx`
