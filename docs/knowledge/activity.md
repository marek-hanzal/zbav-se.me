---
key: activity
title: Activity
summary: Activity notification system and how to work with it
---

Activities are user-facing notification events for interactions between users. Important activities use `priority: high`; regular activities use `priority: common`.

To resolve the real content behind an activity, inspect `family`, `type`, and `payload`. Activity is not the message or listing content itself; it points to the domain entity that should be loaded next.

For `family: transaction`, use `payload.transactionId` as the main input for transaction data and transaction-entry data. When `payload.transactionEntryId` is present, it points to the specific timeline entry that triggered the activity.

For `family: reaction`, use `payload.listingId` as the main input for listing-related data.

## Activity Type Payload Map

The `type` values come from `ActivityTypeEnumSchema`.

| Type | Family | Payload | How to use it |
| --- | --- | --- | --- |
| `buyer-message` | `transaction` | `{ transactionId: string, transactionEntryId?: string }` | A buyer created a transaction message. Load `transaction` by `transactionId`; load or highlight `transaction-entry` by `transactionEntryId` when present. |
| `seller-message` | `transaction` | `{ transactionId: string, transactionEntryId?: string }` | A seller created a transaction message. Load `transaction` by `transactionId`; load or highlight `transaction-entry` by `transactionEntryId` when present. |
| `transaction` | `transaction` | `{ transactionId: string, listingId: string, transactionEntryId?: string, target: "seller" \| "buyer" }` | A transaction lifecycle event. Load `transaction` by `transactionId`; use `listingId` for seller-scoped transaction routes; use `target` to choose the recipient-side detail route. |
| `system` | `transaction` | `{ transactionId: string, listingId: string, transactionEntryId?: string, target: "seller" \| "buyer" }` | A system transaction event. Resolve it like `transaction`; `target` tells which side should open the detail. |
| `unknown` | `transaction` | `{ transactionId: string, listingId: string, transactionEntryId?: string, target: "seller" \| "buyer" }` | Fallback transaction activity. Treat it like `transaction`, but avoid inferring a more specific cause from the type alone. |
| `thumb` | `reaction` | `{ listingId: string, thumb: "like" \| "dislike" }` | A user reacted to a listing with a thumb. Load listing data by `listingId`; `thumb` tells whether it was a like or dislike. |
| `favourite` | `reaction` | `{ listingId: string }` | A user favourited a listing. Load listing data by `listingId`. |
| `unfavourite` | `reaction` | `{ listingId: string }` | A user removed a favourite from a listing. Load listing data by `listingId`. |
| `flag` | `reaction` | `{ listingId: string }` | A user flagged a listing. Load listing data by `listingId`. |
| `unflag` | `reaction` | `{ listingId: string }` | A user removed a flag from a listing. Load listing data by `listingId`. |
| `ignore` | `reaction` | `{ listingId: string }` | A user ignored a listing. Load listing data by `listingId`. |
| `unignore` | `reaction` | `{ listingId: string }` | A user removed an ignore from a listing. Load listing data by `listingId`. |

## Model Guidance

Do not treat activity rows as source content. Treat them as routing and lookup hints.

Use `type` only to pick the payload shape and the user-facing meaning. Use payload identifiers to fetch the actual domain data before answering content-specific questions.
