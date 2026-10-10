# Server

Server code lives in its owning flat source domain. Infrastructure includes `src/authentication/`, `src/database/`, `src/server-env/`, and `src/request-middleware/`; feature effects and database queries live in each domain's `fx/` and `db/` folders. Keep server internals out of client code.

`.dependency-cruiser.cjs` declares the server modules, approved callers, and approved function/schema surfaces by resolved path. Update those groups when adding or moving server code. Type-only imports and `src/@routes/` server glue retain their existing exemptions.

Middleware keeps per-DSN dialect and auth caches so the same runtime reuses the
same server objects for each database target.
E2E teardown explicitly closes the cached dialect for its temporary database
before the database is dropped, so server pools do not outlive short-lived test
databases.
Request-scoped logging is also injected there, so server `*Fn` and `*Fx`
handlers only consume the logger context and do not build it themselves.
Canonical app origin parsing is also exposed through middleware, so server
routes can consume `context.origin` instead of reparsing `VITE_ORIGIN`.

Transactional emails are rendered from React components with React Email and are
then delivered through the shared SMTP transport, so template rendering stays
separate from mail delivery concerns.

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

Seeded and runtime rate-limit rule names use the canonical `domain:rule`
format with a singular domain segment such as `listing:event`,
`auth:password-reset`, or `email:source`.

`rateLimitEventFx` hashes composite caller keys with HMAC-SHA256 before writing
the per-window counter bucket and uses an atomic conflict update for increments.

`rateLimitFx` exposes the same hashed per-window bucket as a read-only snapshot,
so client queries can inspect the current counter without mutating it.

`rateLimitCheckFx` builds on the bucket writer and raises `RateLimitErrorFx`
with mandatory rule metadata when a request crosses the configured limit.

The initial seeded rule `listing:event` caps repeated `(listingId, event)` pairs
to one hit per 10-minute window.

The seeded rule `auth:password-reset` caps reset requests to three attempts
per email address in a 15-minute window.

The migration chain ends at `0056-user-resource-bundle-feature` and targets a
fresh database. Resource grants remain independent of external billing systems.

Effect services use `Context.Service` keys. Typed failures stay in the error
channel; `Effect.result` exposes `Success` and `Failure` values for callers that
need to inspect both outcomes. `Effect.runPromise` rejects with the original
error, so server serialization reads tagged errors directly. Cron schedules use
`Effect.all` with `mode: "result"` to collect independent task failures without
short-circuiting the remaining tasks.

OpenAI Agents tools pass their Zod object schemas directly to the SDK. This
preserves inferred input types and runtime validation, including optional input
normalization in strict mode. Do not cast generated JSON Schema back to Zod:
Zod metadata can emit a root reference, which is unsuitable for tool parameters.
