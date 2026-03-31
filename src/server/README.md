# Server

Server-side code, never should leak to client.

Shared runtime caches that back server middleware live on `globalThis` so one
runtime instance reuses the same dialect and auth objects across server chunks.
