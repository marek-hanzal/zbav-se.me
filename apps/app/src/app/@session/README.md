# @session

Session context on the client – shared authenticated operations (categories, locations, transaction-status) that any logged-in user can use.

## What's here

- Session-specific UI can live here when it is distinct from `@common` (e.g. category/location selection in session context). Mirrors server `@session`.

## Related

- **Can import from**: `@common` only
- **Used by**: `@buyer-user`, `@seller-user`, `@buyer-session`, `@seller-session`, `@user`
