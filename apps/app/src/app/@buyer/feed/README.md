# Feed

## Overview

A **Feed** is a saved search query that allows buyers to quickly access personalized listing results based on their preferences. Think of it as a custom filter or bookmark for the listing marketplace that remembers your search criteria.

## Purpose

Feeds help buyers:
- Save frequently used search parameters
- Quickly access listings matching specific criteria
- Organize multiple searches (e.g., "kids toys nearby", "electronics under 50€", "outdoor gear")
- Track how many new listings match their interests

## Structure

Each Feed contains:

### Core Properties
- `id` - Unique identifier
- `name` - User-defined name (e.g., "Toys for my kids")
- `locationId` - Geographic location filter (optional)
- `query` - Complete ListingQuery object containing filters and sorting

### Query Components

The `query` field stores a `ListingQuery` object with:

#### Filters (`filter`)
- `title` - Text search in listing titles
- `categoryIdIn` - Array of category IDs to include
- `conditionIn` - Array of condition values (e.g., "new", "used", "broken")
- `ageIn` - Array of age categories for items
- Additional listing-specific filters

#### Sorting (`sort`)
- Array of sort criteria (e.g., by price, date, distance)
- Each has `field` and `direction` (asc/desc)

#### Pagination (`cursor`)
- Page number and size for result batching

## User Flow

### Creating a Feed (Wizard)
1. **Location** - Select geographic area
2. **Name** - Give the feed a memorable name
3. **Title** - (Optional) Search text for listing titles
4. **Category** - Select one or more categories
5. **Condition** - Choose item conditions
6. **Age** - Filter by item age/category
7. **Sort** - Define result ordering
8. **Submit** - Save the feed

### Using a Feed
- View feed list (`/buyer/feed/select`)
- Click feed name → View matching listings
- Click "Detail" → Edit feed parameters
- Delete feed if no longer needed

### Editing a Feed
Each feed parameter can be edited individually:
- `/buyer/feed/$id/edit/name`
- `/buyer/feed/$id/edit/location`
- `/buyer/feed/$id/edit/title`
- `/buyer/feed/$id/edit/category`
- `/buyer/feed/$id/edit/condition`
- `/buyer/feed/$id/edit/age`
- `/buyer/feed/$id/edit/sort`

## Limits

- Maximum **10 feeds** per user
- Once limit is reached, user must delete an existing feed to create a new one

## Technical Details

### Schema Hierarchy
```
FeedSchema
├── FeedDbSchema (database fields)
│   ├── id, userId, locationId
│   ├── name
│   ├── query (stored as JSON)
│   └── createdAt, updatedAt
└── query: ListingQuerySchema
    ├── filter: ListingFilterSchema
    ├── sort: ListingSortSchema[]
    └── cursor: CursorSchema
```

### Key Components

#### UI Components
- `FeedContainer` - Full feed detail view with edit/delete actions
- `FeedItem` - Compact feed card in list view
- `FeedList` - Collection view with create button
- `FeedListContainer` - Data-connected list wrapper
- `FeedNameContainer` - Feed name display/edit
- `FeedTitleContainer` - Feed title display/edit

#### API Operations
- `feed-create` - Create new feed
- `feed-fetch` - Get single feed by ID
- `feed-collection` - List user's feeds
- `feed-count` - Count user's feeds (for limit check)
- `feed-patch` - Update feed parameters
- `feed-delete` - Remove feed

### State Management
- Feeds are user-specific (tied to `userId`)
- `updatedAt` timestamp tracks recent usage (for sorting)
- Query object is stored as JSON in database
- Real-time listing count is fetched lazily (Suspense boundary)

## Integration Points

### Listing System
Feeds directly integrate with the listing system:
- Feed query → ListingQuery → Listing collection
- Same query structure used for both feed storage and listing retrieval
- Enables seamless "View feed" → "Show listings" flow

### Location System
- Feeds can be associated with a specific location
- Location affects listing results (distance calculations)
- Optional - feeds can be location-agnostic

### Category System
- Feeds can filter by multiple categories
- Category hierarchy is respected
- Empty categoryIdIn = all categories

## UX Highlights

### Empty State
When user has no feeds:
- Clear call-to-action: "Create your first feed"
- Large button with guidance
- Helps onboard new users

### Limit Reached
When user has 10 feeds:
- Create button becomes disabled
- User must manage existing feeds
- Encourages curation of useful feeds

### Live Counts
Each feed shows:
- Number of matching listings
- Updates in real-time
- Helps users prioritize which feeds to check

## LLM Context

When working with Feeds:
1. **Feed ≈ Saved Search** - It's not a content feed like social media, but a saved query
2. **Immutable Results** - Feed doesn't "remember" listings, it runs a fresh search each time
3. **User Ownership** - Feeds are private to each user
4. **Query Reuse** - The query object can be used anywhere ListingQuery is accepted
5. **Wizard Pattern** - Multi-step creation for better UX on complex filters
6. **Editable Components** - Each filter parameter is independently editable post-creation
