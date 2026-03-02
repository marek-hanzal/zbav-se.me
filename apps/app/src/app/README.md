# App – Domain Structure Overview

The app is split into domain folders that map to server/API access boundaries and SDK surfaces.

## Server/API mapping

- `/api/public/*` -> `@public`
- `/api/session/*` -> `@session`
- `/api/user/*` -> `@user`
- `/api/buyer/*` -> buyer UI domains (`@buyer-session`, `@buyer-user`)
- `/api/seller/*` -> seller UI domains (`@seller-session`, `@seller-user`)

Buyer and seller remain hard-separated in code and routing. Endpoint suffixes and symbol names may be duplicated between roles.

## Folder map

| App folder       | Server API       | Context              | Typical use |
|------------------|------------------|----------------------|-------------|
| `@public`        | `/api/public/*`  | No auth              | Login, register, public pages |
| `@session`       | `/api/session/*` | Authenticated shared | Categories, locations, common lookups |
| `@user`          | `/api/user/*`    | User-private         | Gallery, messages, uploads |
| `@buyer-session` | `/api/buyer/*`   | Session buyer        | Listing browse, listing events, seller info |
| `@buyer-user`    | `/api/buyer/*`   | User-private buyer   | Feeds, favourites, thumbs, ignore, flag, buyer transactions |
| `@seller-session`| `/api/seller/*`  | Session seller       | Buyer info/metrics in seller views |
| `@seller-user`   | `/api/seller/*`  | User-private seller  | Drafts, listings, seller transactions |
| `@common`        | —                | No API               | Shared UI/types/hooks |
| `@seller`        | —                | UI shell             | Seller route composition |

## Dependency direction

- `@common`: no app-domain or SDK imports.
- `@public`: `@common` only.
- `@session`: `@common` only.
- `@user`: `@common`, `@session`.
- `@buyer-session`, `@seller-session`: `@common`, `@session`.
- `@buyer-user`: `@common`, `@session`, `@buyer-session`, `@user`.
- `@seller-user`: `@common`, `@session`, `@seller-session`, `@user`.
- `@seller`: composition-only shell over seller domains.

No buyer <-> seller imports.
