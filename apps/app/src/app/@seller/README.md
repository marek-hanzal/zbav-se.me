# @seller

Seller UI domain.

## Overview

Merged seller domain for both session-level and user-private seller features.

Maps to server API: `/api/seller/*`.

## Scope

- Seller draft and listing management.
- Seller transaction flows, including transaction-entry timeline rendering and status actions.
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
- Seller transaction action buttons now use the seller transaction mutation SDK surface (`accept`, `dispute`, `reject`, `resolve`) and invalidate `transaction-entry` timeline queries.
- Seller message detail UI now reads conversation timeline through `@user/transaction-entry`, with `resolved` treated as seller read-only.
- Seller `TitleContainer` pages that navigate back home now use the shared `@common/nav/BackHomeButton` instead of repeating inline `LinkTo + uiBackButton` wiring.
- Seller listing-level transaction screen now lives in active scope at `@seller/transaction-listing/*`; its hero banner is composed through a local `ListingTransactionHero/*` suspense folder and seller transaction rows now use the local `ui/Item/*` stack, including folder-local `Preview/*` and `StatusIcon.tsx`, to show status-driven content plus client-side last-activity preview instead of repeated listing data.
