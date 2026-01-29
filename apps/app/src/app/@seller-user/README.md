# @seller-user

Seller private context on the client – components and logic for seller-specific operations (drafts, my listings, transactions as seller, transaction-listing).

## What's here

- **draft** – Draft list, item, setup, patches, values, create/delete buttons. Mirrors server `@seller-user/draft`.
- **listing** – My listings UI: Content, List (under `listing/ui/my/`). Create listing flows use draft.
- **transaction** – Seller view of transactions: Transaction, TransactionList, TransactionSheet, TransactionItem, toSellerScoreHint.
- **transaction-listing** – Transactions grouped by listing: TransactionListingList, TransactionListingItem.
- **transaction-status** – Seller-side transaction-status buttons (AcceptButton, ResolveButton).
- **ui** – SellerMenu (entry to seller flows).

## Related

- **Can import from**: `@common`, `@user`, `@seller-session`, `@session`
- **Used by**: Routes under `@routes/$locale/ui/seller/*`
