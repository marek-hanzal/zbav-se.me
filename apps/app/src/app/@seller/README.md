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

- Seller top-level transaction list now lives in active scope at `@seller/transaction-listing/*` instead of the remaining `v0` stack.
- Seller listing aggregate rows now use Inbox-driven unread counts grouped by listing `reference`; badge and unread emphasis must come from Inbox rather than local transaction counters.
- Seller listing-detail transaction rows now also surface Inbox-driven unread state per transaction, using unread `buyer-message` rows whose `reference[]` contains the transaction id.
- Opening a seller transaction detail now bulk-archives matching unread inbox rows for that transaction `reference`, so unread badges clear from both transaction and listing aggregates without requiring an extra Inbox tap.
- Seller top-level transaction rows now render listing title, latest activity label, and latest activity time from the `transaction-listing` aggregate.
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
- Seller listing-level transaction screen now lives in active scope at `@seller/transaction-listing/*`; its hero banner is flattened into a single local component, transaction rows keep their local `ui/Item/*` stack, and seller transaction status labeling now lives in `@seller/transaction/toStatusLabel.ts`.
