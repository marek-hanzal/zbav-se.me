# AGENTS.md - LLM-Optimized Project Context

**Primary Reference**: See `MASTER.md` for complete product concepts, rules, and domain logic. This document focuses on technical architecture and implementation patterns for LLM agents.

**Output language**: Regardless of the input language (e.g. Czech), outputs to files (code, comments, docs, commit messages) must always be in English.

## Project Overview

**Zbav-se.me** is a marketplace application (buying/selling items) built as a monorepo with:
- **apps/app** - Main PWA application (React 19, TanStack Router, TanStack Start SSR)
- **apps/arkini** - Arkini application (React 19, TanStack Router, TanStack Start SSR)
- **apps/web** - Public marketing website (React 19, TanStack Router)
- **apps/server** - Backend API (Hono, Nitro, PostgreSQL, Kysely, Better Auth, Redis, S3)
- **packages/@zbav-se.me/** - Domain packages (sdk, ui, common, buyer, seller)
- **packages/@use-pico/** - Internal framework (client, common, server)

## Tooling & Repo Conventions

### Package manager
- This repo uses **Bun** (`packageManager: bun@...`) and a single root lockfile `bun.lock`.
- Use `bun install` and `bun run <script>` from the repo root.

### Common scripts (run from repo root)
- `bun run dev`: runs all apps in parallel via Turbo (loads env via `dotenv -c development`).
- `bun run build`, `bun run preview`
- `bun run format`: Biome formatter (writes changes)
- `bun run lint`: Biome checks (configured as “check --write”)
- `bun run typecheck`: Turbo typecheck across workspaces
- `bun run test`: Turbo tests across workspaces (server uses Vitest)
- `bun run knip`: Turbo knip across workspaces
- `bun run sdk`: SDK generation (note `biome.json` excludes `**/sdk/src/api`)
- `bun run workflow:check`: formatting + lint + typecheck (use as a quick “CI-like” gate)

### Formatting rules (Biome)
- Indentation is **tabs** and line width is **100** (see `biome.json`).
- Prefer letting Biome apply formatting rather than manual alignment.

### Local infrastructure
- `docker-compose.yml` provides PostgreSQL only (port `5432`, database `zbav_se_me`).

## Core Architecture Principles

### Domain Separation
- **Buyer domain** (`@buyer-user`, `@buyer-session`): Feeds, favourites, transactions (buyer side), thumbs, ignore, flag
- **Seller domain** (`@seller-user`, `@seller-session`): Drafts, listings, transactions (seller side)
- **Session domain** (`@session`): Public data requiring authentication (categories, locations, transaction-status operations)
- **User domain** (`@user`): Private user data (gallery, messages, uploads, user-events)
- **Public domain** (`@public`): Unauthenticated endpoints
- **Arkini domain** (`@arkini`): Arkini app API

### API Structure Pattern
Server API is organized by access level and domain:
- `/api/public/*` - No authentication required
- `/api/session/*` - Requires session (any authenticated user can access)
- `/api/user/*` - Private user data (requires user context)
- `/api/buyer-user/*` - Buyer-specific private operations
- `/api/buyer-session/*` - Buyer-specific session operations
- `/api/seller-user/*` - Seller-specific private operations
- `/api/seller-session/*` - Seller-specific session operations
- `/api/arkini/*` - Arkini app API

Each domain has:
- `with*ApiFx.ts` - Main API setup (Effect-based)
- `with*Hono.ts` - Hono router instance
- Domain-specific modules (e.g., `feed/`, `transaction/`, `listing/`)

### Dependency Rules
```
apps/app → buyer, seller, common, sdk, ui
apps/web → ui only
apps/server → common only (no @zbav-se.me domain packages)
buyer, seller → common, sdk, ui
common → sdk, ui
sdk, ui → no @zbav-se.me dependencies
```

## Key Domain Concepts (Reference MASTER.md)

### Core Entities
- **User**: Core entity, minimal PII (email). Controls feeds, drafts, listings, transactions, inbox, sensitivity, ignore
- **Listing**: Public offer. States: `live`, `expired`, `closed`, `sold`, `banned`. Created from Draft.
- **Draft**: Work-in-progress listing creation. Autosave, non-linear editor.
- **Feed**: Saved search filter (category, location, radius, price, etc.). Types: `user` (saved), `search` (singleton, temporary).
- **Transaction**: Deal envelope. States: `pending`, `open`, `resolved`, `dispute`, `rejected`, `sold`, `expired`, `success`, `closed`. Timeline-based, not chat.
- **Message**: Transaction content. Types: `text`, `gallery`, `location`, `package`, `personal`, `system`. Structured data deleted after transaction ends (except text/gallery).

### Location
- Location is authoritative (geocoded), not free text
- Used in: Feed (radius, distance sorting), Listing (required), Transaction (meeting place)

### Uploads & Gallery
- Upload: Central file record (photos). Lives on external CDN. Lifecycle controlled by parent (listing/transaction).
- Gallery: Ordered collection of uploads. First photo = cover.

### Sensitivity (Content Gating)
Levels: `common` < `adult` < `sensitive` < `restricted`
- Profile sets maximum (what user CAN see)
- Feed sets active level (what user WANTS to see)
- Hard gate: Anything above maximum returns 404 on detail, excluded from listings
- Only sensitivity and admin `banned` can return 404 on detail

### Ignore vs Flag
- **Ignore**: Personal cleanup, hides from listings, doesn't block detail, no global effect
- **Flag**: Report problem, available from detail only, toggle, no auto-effect, metrics only

### Transaction Flow
1. Buyer clicks "Mám zájem" → `pending` (buyer cannot message, can cancel)
2. Seller accepts → `open` (messages unlocked, structured widgets available)
3. Seller marks resolved → `resolved` (listing → `sold`, other transactions on same listing → `sold`)
4. Terminal states: `rejected`, `sold`, `expired` (3 days inactivity), `success`, `closed` (read-only)
5. After terminal: structured data deleted immediately, full transaction deleted after 3 months

### Listing States & Visibility
- `live`: Active, in feeds, all interactions
- `expired`: Auto-expired (expiresAt), not in default feeds, read-only detail, flag allowed
- `closed`: Manually closed, same as expired
- `sold`: Sold, not available, read-only detail, safe actions (flag, undo ignore)
- `banned`: Admin removal, 404 on detail

### Release Window
- Default: +8 hours from `createdAt` before appearing in listings
- Early Access: Buyer pass, ignores release window (max 8h shift)
- Early Delivery: Seller pass per listing, cancels release window for all (max 8h shift)

### Listing Limits
- Active listings: Base limit by subscription tier. Pass adds +20. `sold` doesn't count.
- Photos: Default 3, can increase with pass
- Feeds: Limit on `user` feeds, `search` is unlimited singleton

### Economics Model
- **Tokens**: Internal currency, non-expiring, spendable
- **Coupons**: One-time use, expires after 3 months, cannot stack with active pass
- **Pass**: Time-limited permission/state, expires, can be account-level or listing-level
- **Subscription**: Monthly packages, provides tokens/coupons/passes, auto-renewal, auto-cancels after 2 months inactivity
- **Activation**: Use coupon if available, else spend tokens. Result: one-time action or pass creation/extension
- **Exclusive**: Items only from subscription, not buyable with tokens

### Listing Enhancements
- **Mark**: Visual badge only, no position boost
- **Top**: Priority position in listing (below Top Maxxi), affected by Anti-topper
- **Top Maxxi**: Absolute top position, immune to Anti-topper, max 1 per account
- **Anti-topper**: Buyer pass, mixes Top with regular (Top loses position, keeps badge), Top Maxxi immune
- **Payback**: Compensation for Mark/Top when Anti-topper suppresses, calculated on terminal state, requires Payback pass

### Metrics
- **Listing metrics** (requires Pass): visible, impression, view, thumbs, ignored, transactions, anti-topper ratio
- **User metrics**: karma, XP, score (A-F), reaction time, rejection rate, resolved rate, expiration rate, load, activity, flag rate, closer rate, decision rate
- Metrics are signals, not public scores

## Technical Patterns

### Effect Framework
Server uses Effect for:
- Dependency injection (Context.Tag)
- Error handling
- Async operations
- Function composition (`Effect.fn`, `yield*`)

Example pattern:
```typescript
export const withDomainApiFx = Effect.fn("withDomainApiFx")(function* () {
  const { root, domainHono } = yield* RoutesContextFx;
  const kysely = yield* KyselyContextFx;
  // ... setup
  yield* Effect.all([/* sub-modules */]);
  root.route("/api/domain", domainHono);
});
```

### Database Access
- Kysely ORM for type-safe queries
- Context pattern: `KyselyContextFx` provides database connection
- Query builders in `db/` directories
- Schema validation with Zod

### Authentication
- Better Auth for session management
- Cookie-based authentication
- User context available in `c.get("user")` in Hono handlers

### API Response Patterns
- Success: Direct data or `{ data: T }`
- Errors: `NoticeSchema` with `type: "error"` and message
- 401: "Shooooo! Shooo!" message
- 404: For banned listings or sensitivity mismatch

### Frontend Patterns
- TanStack Router for routing (file-based)
- TanStack Query for data fetching (with persistence)
- TanStack Form for forms
- Server-side rendering with TanStack Start
- Domain routes: `@routes/$locale/buyer/*`, `@routes/$locale/seller/*`, `@routes/$locale/ui/*`
- Domain components: `app/@buyer/*`, `app/@seller/*`
- **Translations**: Translations in the app are automatically generated when using `translator.text(key, fallback?)` from `packages/@use-pico/common/src/translator/translator.ts` — used translation keys are collected and added to i18n files.

### SDK Generation
- `packages/@zbav-se.me/sdk` generated from OpenAPI spec
- Type-safe API client
- Used by frontend apps

## File Organization

### Server (`apps/server/src/`)
```
@buyer-user/          # Buyer private operations
@buyer-session/       # Buyer session operations
@seller-user/         # Seller private operations
@seller-session/      # Seller session operations
@session/             # Public authenticated data
@user/                 # Private user data
@public/               # Unauthenticated endpoints
database/              # Kysely setup, migrations, table definitions
auth/                  # Better Auth setup
routes/context/        # Route context (Effect)
schema/                # Shared Zod schemas
error/                 # Custom error types
```

### App (`apps/app/src/`)
```
@routes/               # TanStack Router routes (file-based)
app/                   # Application components
  @buyer/              # Buyer domain components
  @seller/             # Seller domain components
  auth/                # Authentication
  home/                # Home/navigation
  feed/                 # Feed components
  transaction/         # Transaction components
assets/                # Static assets (fonts, styles)
translation/           # i18n files (cs.yaml, en.yaml)
```

### Packages
```
@zbav-se.me/
  sdk/                 # Generated API client
  ui/                   # Reusable UI components (no domain logic)
  common/               # Shared domain components (age, category, condition, location)
  buyer/                # Buyer-specific components/logic
  seller/               # Seller-specific components/logic

@use-pico/
  client/               # Client utilities, hooks, UI components
  common/               # Shared utilities, types
  server/               # Server utilities
```

## Key Constraints & Rules

1. **No pay-to-win**: Money cannot buy trust/reputation. Score and user metrics unaffected by payments.
2. **Transparency**: Listing rules are explicit. When something is gated, reason is clear.
3. **Automatic expiration**: Listings, transactions, subscriptions auto-expire (prevents zombies).
4. **Hard gates**: Sensitivity and admin bans return 404. Other gates affect listing only.
5. **"Closed is closed"**: Terminal transaction states are read-only, no re-open.
6. **No data selling**: Never. No third-party tracking. Internal metrics only.
7. **Respect user**: No dark patterns, no confirm-shaming, control given (filters, ignore, sensitivity).
8. **Minimal PII**: Only email required. Account is tool, not social profile.

## Development Ports
- `apps/web`: 3030
- `apps/app`: 3031
- `apps/server`: 3032
- `apps/arkini`: 4088
- `apps/blog`: 4090

## Environment Variables
- Server: `SERVER_*` prefix (database, auth, S3, Redis, Geoapify)
- Web/App: `VITE_*` prefix (origins, API endpoints, domain, assets)

## Testing
- Server: Vitest for unit tests
- Test files in `test/` directories
- User event calculations have comprehensive test coverage

## When Implementing Features

1. **Check MASTER.md first**: All domain concepts, rules, and business logic are there.
2. **Respect domain boundaries**: Don't mix buyer/seller logic. Use appropriate API context.
3. **Follow Effect patterns**: Use Context.Tag for dependencies, Effect.fn for composition.
4. **Type safety**: Use Kysely for DB, Zod for schemas, generated SDK types.
5. **Error handling**: Use custom error types (AccessDeniedError, InvalidRequestError, etc.).
6. **Respect limits**: Check subscription tiers, pass states, listing limits before operations.
7. **Transaction lifecycle**: Understand states and terminal conditions.
8. **Sensitivity gates**: Always check user's maximum sensitivity before showing content.
9. **Metrics**: Record events in `listing_event` and `user_event` appropriately.
10. **No shortcuts**: Don't bypass gates, don't create workarounds. Fix the structure.
11. **Update README files**: If a README file exists in the directory you're working in, update/extend it to reflect your changes. Keep all README files current and accurate. This includes domain READMEs (`@buyer-user/README.md`, `@seller-user/README.md`, etc.) and any component/module READMEs.

## Common Patterns to Follow

### Creating API Endpoint
1. Define schema in `schema/` directory
2. Create query builder in `db/` if needed
3. Create effect function in `fx/`
4. Wire up in `with*ApiFx.ts`
5. Add route in appropriate Hono instance

### Frontend Component
1. Use domain package if shared (`@zbav-se.me/buyer`, `@zbav-se.me/seller`)
2. Use `@zbav-se.me/common` for domain-agnostic components
3. Use `@zbav-se.me/ui` for pure UI
4. Use TanStack Query hooks from SDK
5. Handle loading/error states
6. Respect sensitivity settings

### Database Query
1. Use Kysely query builder
2. Use `with*SelectFx` or `with*QueryBuilderFx` pattern
3. Apply scopes for user context (`{ scope: { userId } }`)
4. Validate with Zod schemas
5. Handle errors appropriately

---

**Remember**: MASTER.md is the single source of truth for product concepts. This document is for technical implementation guidance. When in doubt about business logic, check MASTER.md.
