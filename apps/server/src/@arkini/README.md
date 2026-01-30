# @arkini

Arkini API - Domain for the Arkini application.

## Overview

This domain provides API endpoints specific to the Arkini app.

### Board
- **items** - POST `/api/arkini/board/items` - Returns all items on the user's board
- **save** - POST `/api/arkini/board/save` - Replaces all items on the board with the provided items (accepts `{ items: { x, y, level }[] }`)

## Access Rules

- Mounted at `/api/arkini`
- Same authentication model as session domains (cookie-based)

## Related

- **App**: `apps/arkini` - Arkini frontend application
- **Can import from**: `@common`, `@session`
