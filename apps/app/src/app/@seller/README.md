# @seller

The seller's side of the marketplace - posting items, managing listings, and handling buyer requests.

## What's here

**Routes** (`@routes/$locale/seller/`) - seller-facing pages:
- **Create Listing** - wizard flow (photos → title → category → condition → age → location → price → expire-at → submit)
- **My Listings** - view and manage your active posts
- **Transactions** - incoming buyer requests and active deals
- **Shop** - (placeholder for now)
- **User** - profile settings

**Components** (`app/@seller/`) - reusable UI pieces:
- `listing-transaction/` - accept/reject buttons, buyer info, empty states
- `listing-transaction-log/` - status events (request, accepted, rejected, success)
- `ui/` - seller menu with navigation tiles

## How it works

Sellers create **listings** by uploading photos and filling in details (what, where, how much, when it expires). Buyers who match the listing criteria get notified. When a buyer is interested, they start a **transaction** request.

Transaction flow (seller side):
1. Request → buyer wants it, you decide
2. Accept → deal confirmed, arrange pickup/delivery
3. Reject → declined the request
4. Success → completed sale
