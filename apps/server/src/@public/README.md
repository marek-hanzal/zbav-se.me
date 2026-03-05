# @public

Public API - Unauthenticated endpoints and system operations.

## Overview

This domain provides endpoints that don't require authentication. It includes system operations, health checks, development tools, and minimal public data access. Most marketplace functionality requires authentication, so this domain is intentionally minimal.

## What's Here

### Authentication
- **Auth** - Authentication endpoints (login, register, etc.)
- Better Auth integration
- Public authentication operations

### CORS Proxy
- **CORS Proxy** - Cross-origin request proxy
- Development and API access utilities

### Cron Jobs
- **Hourly** - Hourly scheduled tasks
- **Daily** - Daily tasks (day-0, day-4, day-8, day-12, day-16, day-20)
- **Monthly** - Monthly maintenance tasks
- System maintenance and automation

### GitHub Integration
- **History** - GitHub commit history access
- Development and transparency features

### Health Check
- **Health** - System health status
- Monitoring and uptime checks

### Janitor (Cleanup)
- **Cleanup** - Automated cleanup operations
  - Category cleanup
  - Score cleanup
  - Upload cleanup
- Maintenance and data hygiene
- Query performance: upload cleanup resolves orphan uploads using `NOT EXISTS (gallery_item)` and avoids broad joins that can multiply rows.

### Migration
- **Run** - Database migration execution
- Development and deployment operations

### OpenAPI Documentation
- **OpenAPI** - API documentation endpoint
- Scalar UI for API docs
- Generated from route definitions

### MCP Bridge
- **MCP** - `/api/public/mcp`
- Exposes OpenAPI-tagged operations (`mcp`) as MCP tools without re-implementing endpoint logic.
- Uses Better Auth MCP OAuth (`better-auth@1.5.x`) via `withMcpAuth`.
- OAuth metadata and token endpoints are available under `/api/auth` (for example `/.well-known/oauth-authorization-server`).

### Origin
- **Origin** - Origin/domain information
- Configuration and CORS utilities

### Seed
- Public seed API endpoints were removed.
- Effect-only seed implementation lives in `src/seed` and is executed via root scripts:
  - `bun run seed:core --count <n> --user <email>`
  - `bun run seed:interaction --count <n> --user <email>`

## Access Rules

- No authentication required
- Publicly accessible
- Some endpoints may be restricted by IP or environment (cron, janitor, migration)
- **Can import from**: `@common` only
- **Cannot import from**: Any authenticated domain (`@session`, `@user`, `@buyer-session`, `@seller-session`, `@buyer-user`, `@seller-user`)

## Use Cases

- User registration and login
- System health monitoring
- Development and testing (migration)
- API documentation access
- Scheduled maintenance tasks

## Security Considerations

- Most endpoints are system-level and should be protected in production
- Cron, janitor, and migration endpoints should have additional security
- Authentication endpoints are intentionally public

## Related Domains

- `@common` - Can import shared utilities
- All other domains require authentication and cannot be imported
- `@session` - First step after authentication
- `@public` is the entry point for unauthenticated users
