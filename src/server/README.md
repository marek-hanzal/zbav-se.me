# Server

Server-side code, never should leak to client.

Middleware keeps per-DSN dialect and auth caches so the same runtime reuses the
same server objects for each database target.
E2E teardown explicitly closes the cached dialect for its temporary database
before the database is dropped, so server pools do not outlive short-lived test
databases.
Request-scoped logging is also injected there, so server `*Fn` and `*Fx`
handlers only consume the logger context and do not build it themselves.

Transactional emails are rendered from React components in `src/server/email/ui`
using React Email primitives and a mail-specific Tailwind theme, so email-safe
markup stays isolated from the web CSS runtime.

Agent persistence is anchored by `agent_thread`; stream and usage rows reference
that thread so user/thread scope is enforced by the database.

Restriction enum database type is created by the early restriction migration
before category tables, because the same type is shared by category, listing,
draft, and user restriction storage.

Listing-specific attribute rows live in the `listing_attr_*` tables, while draft
editing has its own mirrored `draft` and `draft_attr_*` persistence layer.

Listing fulltext phrases live in `listing_spotlight`, so search-oriented text
can evolve independently from the main listing row shape.

Rate limiting persistence is split between `rate_limit_rule` for reusable rule
definitions and `rate_limit_event` for per-key, per-window counters.

`rateLimitEventFx` hashes composite caller keys with HMAC-SHA256 before writing
the per-window counter bucket and uses an atomic conflict update for increments.

`rateLimitCheckFx` builds on the bucket writer and raises `RateLimitErrorFx`
with mandatory rule metadata when a request crosses the configured limit.

The initial seeded rule `listing-event` caps repeated `(listingId, event)` pairs
to one hit per 10-minute window.

The seeded rule `password-reset-request` caps reset requests to three attempts
per email address in a 15-minute window.
