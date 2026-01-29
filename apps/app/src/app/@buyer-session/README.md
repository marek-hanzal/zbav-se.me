# @buyer-session

Buyer session context on the client – operations that require authentication but work with public/session data.

## What's here

- **listing-event** – Hook and UI for recording listing events (views, impressions) when a buyer browses listings. Mirrors server `@buyer-session/listing-event`.

## Related

- **Can import from**: `@common`, `@session`
- **Used by**: `@buyer-user` (e.g. listing views that record events)
