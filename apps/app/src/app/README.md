# App – Domain Structure Overview

The app is split into domain folders that map to server/API access boundaries and SDK surfaces.

## Server/API mapping

- `/api/public/*` -> `@public`
- `/api/session/*` -> `@session`
- `/api/user/*` -> `@user`
- `/api/buyer/*` -> `@buyer`
- `/api/seller/*` -> `@seller`

Buyer and seller remain hard-separated in code and routing. Endpoint suffixes and symbol names may be duplicated between roles.

## Folder map

| App folder | Server API | Context | Typical use |
|------------|------------|---------|-------------|
| `@public` | `/api/public/*` | No auth | Login, register, public pages |
| `@session` | `/api/session/*` | Authenticated shared | Categories, locations, common lookups |
| `@user` | `/api/user/*` | User-private shared | Gallery, inbox, transaction-entry timeline, uploads |
| `@buyer` | `/api/buyer/*` | Buyer domain | Buyer listing, feed, preference, transaction flows |
| `@seller` | `/api/seller/*` | Seller domain | Seller draft, listing, transaction flows |
| `@common` | — | No API | Shared UI/types/hooks |

## Dependency direction

- `@common`: no app-domain or SDK imports.
- `@public`: `@common` only.
- `@session`: `@common` only.
- `@user`: `@common`, `@session`.
- `@buyer`: `@common`, `@session`, `@user`.
- `@seller`: `@common`, `@session`, `@user`.

No buyer <-> seller imports.

## Navigation additions

- Added user inbox route: `/$locale/inbox/$type` (`high` or `common`).
- Home menu message entry now points to Inbox (`Inbox (label)`).
- Buyer and seller transaction flows now use stable `transaction` routes instead of legacy `message` paths:
  - `/$locale/buyer/transaction/list`
  - `/$locale/buyer/transaction/$transactionId/detail`
  - `/$locale/seller/transaction/list`
  - `/$locale/seller/transaction/$listingId/list`
  - `/$locale/seller/transaction/$transactionId/detail`
- Message conversation detail now uses dedicated routes instead of bottom sheets:
  - `/$locale/buyer/transaction/$transactionId/detail`
  - `/$locale/seller/transaction/$transactionId/detail`
- Message and inbox pages now use explicit back-to-home links.
- Internal message conversation data now comes from `transaction_entry` APIs even where UX copy still says “Messages”.

## Inbox invariant

- Inbox is the source of truth for unread state, badge counts, grouped unread counts by `reference`, and similar "needs attention" UI signals.
- App features must reuse Inbox family/reference counts instead of inventing local unread counters or transaction-status-based badge logic.
