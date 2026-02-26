# @seller-user

Seller User – private seller operations requiring user context.

## Overview

This domain contains components and logic for seller operations that work with **user-private data**: drafts, listing creation, and the seller side of transactions.

Maps to server API: `/api/seller-user/*`.

## What's Here (scope)

- **Draft** – list drafts, create, edit (autosave), delete, publish as listing
- **Draft Gallery** – photos for draft, uploads
- **Listing Create** – publish draft as live listing
- **Transaction (seller)** – seller's transaction list, detail, accept/reject
- **Transaction Listing** – listings linked to transactions
- **Transaction Status** – accept (pending → open), resolve (listing → sold)
- **User Events** – seller metrics (activity, reaction time, rejection rate, resolved rate, load, score)

## Rules (critical)

Same dependency rules as server: domain boundaries and package usage must be respected.

### Imports from other app domains

- **May import from**: `@common`, `@session`, `@seller-session`, `@user`.
- **Must not import from**: `@buyer-user`, `@buyer-session`, `@seller-user` (self), `@public`.

### SDK import rules

SDK is organized by the same domains as the server (and UI). Same rules as domain imports above.

- **May use SDK for**: `seller-user`, `session`, `seller-session`, `user` (i.e. `/api/seller-user/*`, `/api/session/*`, `/api/seller-session/*`, `/api/user/*`).
- **Must not use SDK for**: `buyer-user`, `buyer-session`, `public` (different or unauthenticated domain).

### Context

- **Requires**: authentication + user context (user-private data).
- Top-level seller domain – may use all seller-related and general session/user resources.

## Use Cases

- Creating and editing listing drafts.
- Publishing listings from drafts.
- Managing incoming buyer requests.
- Accepting/rejecting transactions.
- Marking completed sales (resolve).
- Viewing seller metrics.

## Related Domains

- `@common` – shared utilities.
- `@session` – categories, location, transaction-status, upload/S3.
- `@seller-session` – seller info, user events (seller).
- `@user` – gallery, messages, uploads.

## Recent updates

- Draft editor was split into focused modules in `@seller-user/draft/ui/DraftEditor/`:
  - `DraftEditorDefaultView.tsx` as top-level orchestrator
  - `RequiredFieldsSection.tsx`
  - `OptionalFieldsSection.tsx`
  - `ActionSection.tsx`
  - `ChevronAction.tsx`
  - `createDraftEditorViews.tsx` for patch view mapping
  - each section owns its own namespaced `Props`
  - `DraftEditor.View` namespace type as source of truth for editor views
- Seller listing list components now resolve locale via `useLocale()` instead of accepting `locale` props.
- Seller flow routes now use page components:
  - `@seller-user/draft/page/DraftListPage.tsx`
  - `@seller-user/listing/page/MyListingPage.tsx`
  - `@seller-user/listing/page/ListingViewPage.tsx`
  - `@seller-user/transaction-listing/page/MessageListPage.tsx`
  - `@seller-user/transaction-listing/page/ListingMessageListPage.tsx`
  - `@seller-user/transaction-listing/page/ListingMessageListPendingPage.tsx`
- Draft edit page was extracted from `v0` to active scope at `@seller-user/draft/page/DraftEditPage.tsx`.
- Seller transaction list now uses domain-local container/pending components in `@seller-user/transaction/ui/` (no shared `@common` transaction list abstraction).
- Seller feature call-sites increasingly use local `*Suspense` wrappers (for `Pending` + data composition) to keep suspense boundaries close to feature roots (`draft`, `listing`, `transaction`, `transaction-listing`).
- Draft editor now follows local suspense composition: `DraftEditor.tsx` is a suspense wrapper, `DraftEditor/Data.tsx` owns draft fetch by `draftId`, and `DraftEditor/Pending.tsx` uses `SpinnerContainer`.
- Draft editor suspense internals were extracted to active scope:
  - `@seller-user/draft/ui/DraftEditor/Data.tsx`
  - `@seller-user/draft/ui/DraftEditor/Pending.tsx`
- Seller draft list now uses `withDraftQuery` collection hydration (`useCollectionQuery` + per-item `useQuery`) and keeps `data-ui` labels aligned with the bracketed contract.
- Seller transaction list now uses `withTransactionQuery` collection hydration with configurable collection `refetchInterval`.
- Seller transaction-listing list now uses `withTransactionListingQuery` cache hydration and renders card data from transaction-listing payload (no per-item listing fetch).
