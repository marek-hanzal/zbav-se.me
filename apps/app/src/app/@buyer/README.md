# @buyer

Buyer UI domain.

## Overview

Merged buyer domain for both session-level and user-private buyer features.

Maps to server API: `/api/buyer/*`.

## Scope

- Listing browsing, seller info, listing events.
- Buyer feeds, favourites, ignore/flag/thumb actions.
- Buyer transaction and transaction-status flows.

## Imports

- May import from: `@common`, `@session`, `@user`.
- Must not import from: seller domains, `@public`, self.

## SDK

- May use: `buyer`, `session`, `user`.
- Must not use: `seller`, `public`.

## Recent updates

- Feed editor gallery patch was moved to active scope:
  - `@buyer/feed/FeedEditor/patch/GalleryPatch.tsx`
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
