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
| `@user` | `/api/user/*` | User-private shared | Gallery, messages, uploads |
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
