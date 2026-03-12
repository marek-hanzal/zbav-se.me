# @buyer

Buyer UI domain.

## Overview

Merged buyer domain for both session-level and user-private buyer features.

Maps to server API: `/api/buyer/*`.

## Scope

- Listing browsing, seller info, listing events.
- Buyer feeds, favourites, ignore/flag/thumb actions.
- Buyer transaction flows, including transaction-entry timeline rendering and status actions.

## Imports

- May import from: `@common`, `@session`, `@user`.
- Must not import from: seller domains, `@public`, self.

## SDK

- May use: `buyer`, `session`, `user`.
- Must not use: `seller`, `public`.

## Recent updates

- Feed editor gallery patch was moved to active scope:
  - `@buyer/feed/FeedEditor/patch/GalleryPatch.tsx`
- Buyer transaction detail now imports shared transaction-entry timeline rendering from active common scope at `@common/transaction-entry/*` instead of the old `v0` common stack.
- Buyer transaction detail root component, message, toolbar, menu, chat, and status stacks now live in active scope at `@buyer/transaction/ui/*`; the shared bottom-sheet trigger button now lives in `@common/transaction/ui/TransactionMenuButton.tsx`.
- Buyer transaction list stack now lives in active scope at `@buyer/transaction/ui/TransactionList/*`; the old `v0` buyer list wrapper/data/item stack is no longer used by the route.
- Feed editor value components with single usage were localized to feed editor:
  - `@buyer/feed/FeedEditor/value/`
    - `AgeValueList.tsx`
    - `ConditionValueList.tsx`
    - `NameValue.tsx`
    - `RangeValue.tsx`
    - `SortValue.tsx`
    - `WarrantyValueList.tsx`
- Listing list container for feed pages was moved out of `v0` and localized to feed listing page:
  - `@buyer/feed/FeedListingPage/ListingList/ListingList.tsx`
- Favourite listings page is now active scope (`v0` no longer used by route):
  - `@buyer/favourite/FavouriteListPage/FavouriteListPage.tsx`
  - `@buyer/favourite/FavouriteListPage/FavouriteList/`
- Favourite toggle button for feed listing card is localized to page scope:
  - `@buyer/feed/FeedListingPage/FavouriteButton/`
- Buyer message list page is now active scope (`v0` page removed):
  - `@buyer/transaction/MessageListPage/MessageListPage.tsx`
  - `@buyer/transaction/~public/MessageListPage.ts`
- Search route now reuses the existing feed editor inline and routes saved search results through feed listing:
  - `@buyer/search/SearchPage/SearchPage.tsx`
  - `@buyer/search/SearchPage/SearchEditor.tsx`
  - `@buyer/search/SearchPage/SearchButton.tsx`
  - `@buyer/search/SearchPage/SaveAsFeedButton.tsx`
  - `@buyer/search/SearchPage/ResetButton.tsx`
- Buyer transaction action buttons now use the buyer transaction mutation SDK surface (`close`, `dispute`, `reject`, `success`) and invalidate `transaction-entry` timeline queries.
- Buyer message detail UI now reads conversation timeline through `@user/transaction-entry` instead of the removed message query wrapper.
- Buyer `TitleContainer` pages that navigate back home now use the shared `@common/nav/BackHomeButton` instead of repeating inline `LinkTo + uiBackButton` wiring.
