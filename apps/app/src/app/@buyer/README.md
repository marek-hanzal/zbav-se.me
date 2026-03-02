# @buyer

Buyer UI domain.

## Overview

Merged buyer domain for both session-level and user-private buyer features.

Maps to server API: `/api/buyer/*`.

## Scope

- Listing browsing, seller info, listing events.
- Buyer feeds, favourites, ignore/flag/thumb actions.
- Buyer transaction and transaction-status flows.

## Imports

- May import from: `@common`, `@session`, `@user`.
- Must not import from: seller domains, `@public`, self.

## SDK

- May use: `buyer`, `session`, `user`.
- Must not use: `seller`, `public`.
