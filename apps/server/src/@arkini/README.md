# @arkini

Arkini API - Domain for the Arkini application.

## Overview

This domain provides API endpoints specific to the Arkini app.

### Board
- **items** - GET `/api/arkini/board/items` - Returns current items on the board (array of `{ x, y }`)

## Access Rules

- Mounted at `/api/arkini`
- Same authentication model as session domains (cookie-based)

## Related

- **App**: `apps/arkini` - Arkini frontend application
- **Can import from**: `@common`, `@session`
