# @buyer-user

Buyer private context on the client – components and logic for buyer-specific operations (feeds, favourites, listing browse, transactions as buyer).

## What's here

- **feed** – Feed list, items, setup sheet, patches, values. Mirrors server `@buyer-user/feed`.
- **feed-favourite** – Favourite feeds list. Mirrors server `@buyer-user/feed-favourite`.
- **listing** – Listing browse UI: Hero, Detail, Sheet, ListContainer, overlay, buttons (Favourite, Flag, Ignore, Thumbs, Transaction, SellerInfo). Uses `@buyer-session/listing-event` for event recording.
- **transaction** – Buyer view of transactions: Transaction, TransactionList, TransactionSheet, TransactionItem, BuyerInfo, BuyerInfoButton, toBuyerScoreHint.
- **transaction-status** – Buyer-side transaction-status buttons (e.g. SuccessButton).
- **ui** – BuyerMenu (entry to buyer flows).

## Related

- **Can import from**: `@common`, `@user`, `@buyer-session`, `@session`
- **Used by**: Routes under `@routes/$locale/ui/buyer/*`, `@routes/$locale/flow/buyer/*`
