# App – Domain Structure Overview

The app is split into **domain folders** that mirror the **server API** and the **generated SDK**. This keeps access boundaries clear, avoids cross-role leakage, and makes it obvious which UI talks to which endpoints.

## Why It’s Split This Way

1. **Same boundaries as the server**  
   The server exposes APIs by access level and role: `/api/public/*`, `/api/session/*`, `/api/user/*`, `/api/buyer-user/*`, `/api/buyer-session/*`, `/api/seller-user/*`, `/api/seller-session/*`. The app uses folders with the same names (`@public`, `@session`, `@user`, `@buyer-user`, `@buyer-session`, `@seller-user`, `@seller-session`) so that:
   - Each UI domain only uses the API (and SDK) it’s allowed to.
   - You can reason about “this screen is buyer-private” vs “this is session-only” by folder alone.

2. **SDK matches server and app**  
   The SDK is generated from the server’s OpenAPI spec and is organized by the same API prefixes. So `@buyer-user` in the app uses SDK clients for `buyer-user` (and allowed lower-level domains like `session`, `user`); it must not use `seller-user` or `seller-session`. The folder structure enforces that at a glance and via import rules.

3. **Session vs user, buyer vs seller**  
   - **Session** = any authenticated user; data is “public in protected space” (e.g. categories, locations, transaction-status).
   - **User** = requires user context; private data (galleries, messages, uploads, preferences).
   - **Buyer/Seller** = role-specific. Each has:
     - **-session**: session-only, no user-private data (e.g. browsing listings, listing events, seller info on a card).
     - **-user**: user-private (feeds, favourites, thumbs, drafts, transactions, etc.).

4. **Strict import and SDK rules**  
   Each domain README defines:
   - Which other app domains it may import from.
   - Which SDK API surfaces it may use.
   This prevents buyer code from pulling in seller logic, and session-only code from touching user-private APIs.

## Folder Map (App ↔ Server ↔ SDK)

| App folder       | Server API            | Context              | Typical use |
|------------------|-----------------------|----------------------|-------------|
| `@public`        | `/api/public/*`       | No auth              | Login, register, public pages |
| `@session`       | `/api/session/*`      | Authenticated, shared| Categories, locations, transaction-status, upload/S3 |
| `@user`          | `/api/user/*`         | User-private         | Gallery, messages, uploads, user events |
| `@buyer-session` | `/api/buyer-session/*`| Session, buyer role  | Listing browse, listing events, buyer info in transaction |
| `@buyer-user`    | `/api/buyer-user/*`   | User-private, buyer  | Feeds, favourites, thumbs, ignore, flag, buyer transactions |
| `@seller-session`| `/api/seller-session/*`| Session, seller role | Seller info on listing, seller metrics (for buyers) |
| `@seller-user`   | `/api/seller-user/*`  | User-private, seller | Drafts, listings (my), seller transactions |
| `@common`        | —                     | No API               | Shared UI, types, hooks, validation; no domain/SDK calls |
| `@seller`        | —                     | UI shell             | Seller routes and menu; uses `@seller-user` / `@seller-session` |

## Dependency Direction

- **@common**: No app-domain or SDK imports; used by every domain.
- **@public**: Only `@common`; only public SDK.
- **@session**: Only `@common`; only session SDK.
- **@user**: `@common`, `@session`; session + user SDK.
- **@buyer-session**, **@seller-session**: `@common`, `@session`; session + own SDK.
- **@buyer-user**: `@common`, `@session`, `@buyer-session`, `@user`; SDK for those.
- **@seller-user**: `@common`, `@session`, `@seller-session`, `@user`; SDK for those.
- **@seller**: Composes seller UI; uses seller domains (and routes under `@routes/$locale/.../seller/`).

So: **public → session → user / buyer-session / seller-session → buyer-user / seller-user**. No buyer ↔ seller imports; no session/user domains importing from role-specific domains.

## Where to Read More

- **Per-domain details** (scope, import rules, SDK rules, use cases): see the README in each folder (`@public/README.md`, `@session/README.md`, `@user/README.md`, `@buyer-user/README.md`, `@buyer-session/README.md`, `@seller-user/README.md`, `@seller-session/README.md`, `@common/README.md`, `@seller/README.md`).
- **Server layout and API**: `apps/server/src/` and `AGENTS.md` (API structure and domain rules).
- **Product and domain concepts**: `MASTER.md`.
