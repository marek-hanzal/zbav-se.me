# @arkini

Arkini API - Domain for the Arkini application.

## Overview

This domain provides API endpoints specific to the Arkini app.

### Board Item
- **collection** - POST `/api/arkini/board-item/collection` - Returns board items (paginated collection)
- **fetch** - POST `/api/arkini/board-item/fetch` - Fetch a single board item by query (where.id)
- **patch** - POST `/api/arkini/board-item/patch` - Update a board item (x, y, level)

## Access Rules

- Mounted at `/api/arkini`
- Same authentication model as session domains (cookie-based)

## Related

- **App**: `apps/arkini` - Arkini frontend application
- **Can import from**: `@common`, `@session`
