# @arkini

Arkini API - Domain for the Arkini application.

## Overview

This domain provides API endpoints specific to the Arkini app.

### Board Item
- **collection** - POST `/api/arkini/board-item/collection` - Returns board items (paginated collection)
- **patch** - POST `/api/arkini/board-item/patch` - Update a board item (x, y, level)

## Access Rules

- Mounted at `/api/arkini`
- Same authentication model as session domains (cookie-based)

## Related

- **App**: `apps/arkini` - Arkini frontend application
- **Can import from**: `@common`, `@session`
