# Server

Server-side code, never should leak to client.

Middleware keeps per-DSN dialect and auth caches so the same runtime reuses the
same server objects for each database target.
