# Server

Server-side code, never should leak to client.

Middleware keeps per-DSN dialect and auth caches so the same runtime reuses the
same server objects for each database target.
Request-scoped logging is also injected there, so server `*Fn` and `*Fx`
handlers only consume the logger context and do not build it themselves.

Agent persistence lives in dedicated append-only tables such as
`agent_stream` and `agent_usage`.
