# @buyer

The buyer's side of the marketplace - finding stuff, saving searches, and buying things.

## What's here

**Routes** (`@routes/$locale/buyer/`) - buyer-facing pages:
- **Feed** - custom search filters (location, category, condition, age, etc.) that refresh with new listings
- **Favourites** - categories you're watching, shows listing counts
- **Listings** - browse items, score them, view seller info
- **Transactions** - your purchase history and active deals
- **Shop** - (placeholder for now)
- **User** - profile settings

**Components** (`app/@buyer/`) - reusable UI pieces:
- `feed/` - feed list, items, wizard for creating new feeds
- `transaction/` - transaction cards, empty states, seller info
- `transaction-log/` - status events (pending, open, rejected, completed, cancelled)
- `ui/` - buyer menu with navigation tiles

## How it works

Buyers create **feeds** (saved searches) with specific filters. The app notifies them when new matching listings appear. They add interesting categories to their **favourites**, browse listings, and start **transactions** with sellers.

Transaction flow (buyer side):
1. Request → waiting for seller
2. Accepted → deal confirmed
3. Success → completed purchase
4. Rejected/Closed → deal fell through
