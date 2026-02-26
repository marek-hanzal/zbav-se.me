# @buyer-user

Buyer User – private buyer operations requiring user context.

## Overview

This domain contains components and logic for buyer operations that work with **user-private data**: saved feeds, favourite categories, ignored listings, thumbs (like/dislike), and the buyer side of transactions.

Maps to server API: `/api/buyer-user/*`.

## What's Here (scope)

- **Feed** – create, edit, delete feeds; UI for filters (category, location, price, condition, age, …)
- **Favourites** – favourite categories, add/remove, listing counts
- **Feed Favourites** – favourite categories in feed context
- **Feed Gallery** – gallery of saved search results
- **Ignore** – ignore/unignore a listing (personal cleanup)
- **Flag** – report a problem (from listing detail only)
- **Thumb** – like/dislike a listing
- **Transaction (buyer)** – buyer's transaction list, create interest, detail, updates
- **Transaction Status** – transaction status operations on the buyer side

## Rules (critical)

Same dependency rules as server: domain boundaries and package usage must be respected.

### Imports from other app domains

- **May import from**: `@common`, `@session`, `@buyer-session`, `@user`.
- **Must not import from**: `@seller-user`, `@seller-session`, `@buyer-user` (self), `@public`.

### SDK import rules

SDK is organized by the same domains as the server (and UI). Same rules as domain imports above.

- **May use SDK for**: `buyer-user`, `session`, `buyer-session`, `user` (i.e. `/api/buyer-user/*`, `/api/session/*`, `/api/buyer-session/*`, `/api/user/*`).
- **Must not use SDK for**: `seller-user`, `seller-session`, `public` (different or unauthenticated domain).

### Context

- **Requires**: authentication + user context (user-private data).
- Top-level buyer domain – may use all buyer-related and general session/user resources.

## Use Cases

- Managing saved searches (feeds).
- Tracking favourite categories.
- Ignoring unwanted listings.
- Rating listings (thumbs).
- Starting and managing purchase transactions.
- Viewing buyer metrics.

## Related Domains

- `@common` – shared utilities.
- `@session` – general session operations (categories, location, transaction-status).
- `@buyer-session` – browsing listings, listing events.
- `@user` – gallery, messages, uploads.

## Recent updates

- Buyer feed route UI has route-level helpers colocated under `@buyer-user/feed/page/FeedListPage/` (setup button, editor sheet, empty/appendix/first-listing statuses) to keep page files smaller and easier to read.
- Favourite feed list route keeps route-specific status/appendix components under `@buyer-user/feed/page/FeedFavouriteListPage/`:
  - `EmptyFavouriteStatus.tsx`
  - `EmptyFeedStatus.tsx`
  - `FavouriteListAppendix.tsx`
- Listing detail was split into focused parts in `@buyer-user/listing/ui/ListingDetail/`:
  - `ListingHeroSection.tsx`
  - `ListingInfoSection.tsx`
  - `ListingSellerInfoSuspense/Data.tsx`
  - `ListingDestructiveActionsSuspense/Data.tsx`
- Feed editor decomposition in `@buyer-user/feed/ui/FeedEditor/`:
  - `FeedEditorFields.tsx`
  - `FeedEditorDeleteButton.tsx`
  - types are owned by `FeedEditor` namespace
- Buyer feed list route decomposition:
  - `@routes/$locale/buyer/feed/$id/list.tsx` keeps loader + route composition.
  - `@buyer-user/feed/page/FeedListPage.tsx` owns page UI/state composition.
- Feed flow routes now use page components in `@buyer-user/feed/page/`:
  - `FeedListPage.tsx`
  - `FeedFavouriteListPage.tsx`
  - `FeedSelectPage.tsx`
  - `FeedDefaultPendingPage.tsx`
- Feed/listing components no longer accept `locale` as prop; locale is read via `useLocale()` inside the component.
- Buyer favourite/message flow routes now use page components:
  - `@buyer-user/feed-favourite/page/FavouriteListPage.tsx`
  - `@buyer-user/transaction/page/MessageListPage.tsx`
- Buyer transaction list now uses domain-local container/pending components in `@buyer-user/transaction/ui/` (no shared `@common` transaction list abstraction).
- Buyer feature call-sites increasingly use local `*Suspense` wrappers (for `Pending` + data composition) to keep suspense boundaries close to feature roots (`feed`, `listing`, `transaction`, `feed-favourite`).
- Feed editor fields split by UI sections in `@buyer-user/feed/ui/FeedEditor/`:
  - `IdentitySection.tsx`
  - `CategorySection.tsx`
  - `LocationSection.tsx`
  - `SortSection.tsx`
  - `FilterSection.tsx`
  - `TitleSection.tsx`
- Feed list page now resolves absolute empty state via listing `count.total` (global no-data) while keeping feed-filter empty in the list-level empty renderer.
- Buyer transaction list now runs on `withTransactionQuery` collection cache hydration (`useCollectionQuery` + per-item `useQuery`) with configurable collection `refetchInterval`.
- Buyer feed delivery patch now uses active-scope delivery selector:
  - `@common/delivery/ui/DeliverySelect.tsx`
- Buyer feed warranty patch now uses active-scope warranty selector:
  - `@common/warranty/ui/WarrantySelect.tsx`
