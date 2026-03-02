# @common

Common – shared resources and utilities across domains (no own API).

## Overview

This domain contains **shared components, types, and utilities** used by multiple other domains. It has no own API or routes; it serves as a source of shared functionality that any domain may import.

## Purpose

- Avoid code duplication across domains.
- Shared contexts and configuration (e.g. transaction context, upload context).
- Central shared business logic and types.
- Consistency at domain boundaries.

## Scope note

What goes into `@common` should be **low-level, foundational** pieces. Prefer putting here only things that are clearly **@session**, **@user**, or **@public** in nature. Avoid moving **buyer/seller-specific** logic or UI into `@common`; with role-specific code there is a higher risk of context or domain leaking (e.g. buyer/seller assumptions used in the wrong place or data exposed across boundaries).

## What's Here (scope)

- **Shared UI** – buttons, forms, layout pieces without domain logic
- **Shared types** – types for transactions, transaction status, user events, listing (pros/cons, expire)
- **Shared schemas/validation** – validation usable on the frontend (e.g. query params, filters)
- **Shared hooks/utils** – pure utilities with no dependency on a specific domain
- **Transaction context** – default transaction settings (expires, extend)
- **Upload / S3** – shared upload configuration (CDN, bucket) – when used on the frontend

## ⚠️ Important: @common relaxes import rules

**Placing something in `@common` effectively loosens the usage rules** — anything here can be imported by every domain (`@public`, `@session`, `@user`, buyer/seller, etc.). That makes `@common` a potential way to bypass the normal import restrictions between domains. **You must be extremely careful**: only add truly shared, low-level, and non–role-specific pieces. Do not use `@common` as a shortcut to share code that really belongs in one domain or that could leak context or data across boundaries.

## Rules (critical)

Same dependency rules as server: domain boundaries and package usage must be respected. `@common` is the foundation layer; it must not depend on other app domains or on role-specific packages.

### Imports from other app domains

- **May import from**: none. Must not import from any other app domain (`@public`, `@session`, `@user`, `@buyer`, `@seller`).
- **Used by**: any domain may import from `@common`.

### SDK import rules

SDK is organized by the same domains as the server (and UI). Same rules as domain imports above.

- **May use SDK for**: none. `@common` must not call API (no domain surface in shared layer).
- **Must not use SDK for**: any domain (buyer, seller, session, user, public).

### Context

- **No own API/routes** – this domain does not expose HTTP.
- Foundation layer – all domains may depend on it.

### Security

Common resources are "open" in the sense that **any** domain may use them, including `@public` and `@session`. When adding or changing things in `@common`, take care not to leak sensitive or user-scoped data: nothing in `@common` may bypass domain-level access checks or expose data outside the intended scope.

## Use Cases

- Shared Effect/React contexts and providers.
- Common types and validation schemas.
- Utility functions used across domains.
- Business logic that does not belong to a single domain.

## Related Domains

- All domains may import from `@common`.
- `@buyer` / `@seller` – use transaction context and shared types.
- `@session` – may use common utilities.
- `@public` – may use common utilities (with care for sensitive data).

## Adding New Resources

When adding to `@common`:
1. Ensure the resource is truly shared across multiple domains.
2. Avoid domain-specific logic – keep it generic.
3. Document the resource in this README.
4. Consider whether it should live in a domain package (`@zbav-se.me/buyer`, `@zbav-se.me/seller`, …) instead.

## Recent updates

- Transaction list container abstraction was removed from `@common/transaction/ui/`; buyer/seller now keep their own domain-specific list containers to avoid cross-domain generic query wrappers.
- Message rendering was split into focused parts:
  - `@common/message/MessageListSuspense/MessageList.tsx` now handles data/container composition.
  - `@common/message/MessageListSuspense.tsx` now composes local suspense fallback (`MessageListPending`) for feature call-sites.
  - `@common/message/MessageRenderItem.tsx` now owns message-type dispatch (`text/system/gallery/location/personal/package`).
- Auth utilities were extracted to active scope:
  - `@common/auth/authClient.ts`
  - `@common/auth/getSessionFn.ts`
  - `@common/auth/query/withSessionQuery.ts`
  - `@common/auth/hook/useUser.ts`
  - `@common/auth/mutation/withSignOutMutation.ts`
  - `SignOutButton` is now page-local at `@user/profile/UserPage/SignOutButton.tsx`
- Photo upload UI was extracted to active scope and split into focused pieces:
  - `@common/photo/ui/PhotoUpload/PhotoUpload.tsx` is the local root component (`index.ts` exports `PhotoUpload` only).
  - `@common/photo/ui/PhotoUpload/useController.ts` owns upload/input/pending orchestration.
  - `@common/photo/ui/PhotoUpload/Pending.tsx`
  - `@common/photo/ui/PhotoUpload/Placeholder.tsx`
  - `@common/photo/ui/PhotoUpload/Preview.tsx`
  - `@common/photo/ui/PhotoUpload/PhotoUploadPreviewImageSuspense.tsx` composes local suspense fallback (`PhotoUploadPreviewImagePending`).
- Route shell pages were extracted into shared components:
  - `@common/locale/LocalePage/LocalePage.tsx`
  - `@common/nav/page/UiPage.tsx`
- Save action footer container was extracted to active scope:
  - `@common/container/ui/SaveContainer.tsx`
- `LocationSelect` component was extracted to active scope:
  - `@common/location/ui/LocationSelect.tsx`
  - `@common/location/ui/LocationSelect/ListContainer/*`
- PatchContainer abstraction was removed; patch views now compose `TitleContainer`/`Container` + `SaveContainer` inline at call-sites.
- `LocationSelectContainer` abstraction was removed; call-sites now embed `LocationSelect` + `SaveContainer` inline.
- `PriceTypeSelect` was extracted to active scope:
  - `@common/price-type/ui/PriceTypeSelect/PriceTypeSelect.tsx`
  - `@common/price-type/ui/PriceTypeSelect/Item.tsx`
- `ExpireAtSelect` was extracted to active scope and split into folder-local parts:
  - `@common/expire-at/ui/ExpireAtSelect/ExpireAtSelect.tsx`
  - `@common/expire-at/ui/ExpireAtSelect/ExpireAtItem.tsx`
- Restriction select options now render two-line static labels (`value` + `hint`) for all restriction enum variants, including `adult-relaxed`.
- `RestrictionSelect` was extracted to active scope:
  - `@common/restriction/ui/RestrictionSelect/RestrictionSelect.tsx`
  - `@common/restriction/ui/RestrictionSelect/Item.tsx`
- `DeliverySelect` was extracted to active scope:
  - `@common/delivery/ui/DeliverySelect.tsx`
- `WarrantySelect` was extracted to active scope:
  - `@common/warranty/ui/WarrantySelect.tsx`
- `AgeSelection` was extracted to active scope:
  - `@common/age/ui/AgeSelection.tsx`
- `ConditionSelect` was extracted to active scope:
  - `@common/condition/ui/ConditionSelect.tsx`
- Remaining condition UI parts were extracted to active scope:
  - `@common/condition/ui/ConditionIcon.tsx`
- `GalleryPreview` was extracted to active scope:
  - `@common/gallery/ui/GalleryPreview.tsx`
- `GalleryUploadContainer` abstraction was removed; gallery upload flow is now embedded directly at call-sites.
