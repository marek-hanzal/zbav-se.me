# Server

Server-side code, never should leak to client.

Middleware keeps per-DSN dialect and auth caches so the same runtime reuses the
same server objects for each database target.
Request-scoped logging is also injected there, so server `*Fn` and `*Fx`
handlers only consume the logger context and do not build it themselves.

Agent persistence is anchored by `agent_thread`; stream and usage rows reference
that thread so user/thread scope is enforced by the database.

Restriction enum database type is created by the early restriction migration
before category tables, because the same type is shared by category, listing,
draft, and user restriction storage.
