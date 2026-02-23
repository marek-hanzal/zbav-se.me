# Zbav se mě!

A marketplace application for buying and selling items, built with React, TanStack, and Effect.

## Why this repository is public (but not Open Source)

This repository is intentionally **public**, but it is **not Open Source**.

The source code is available to provide transparency, enable security and quality audits, and allow others to study how the system works.  
You are welcome to read the code, review it, learn from it, and point out problems or improvements.

However, this project represents an active, living product.  
The code alone is not the product, but it is still protected.

Commercial use, hosting, redistribution, or operating a competing service based on this code is **not permitted** without explicit permission.  
Please read the license carefully before using any part of this repository.

In short:
You can **look**, **learn**, and **help**.  
You cannot **repackage**, **deploy**, or **profit** from it.

This approach allows openness without pretending that “free code” automatically means “free business”.


## Development Ports

Each application runs on its own port in development mode:

| Port | App | Description |
|------|-----|-------------|
| **3030** | `apps/web` | Public marketing website (about, privacy policy, landing pages) |
| **3031** | `apps/app` | Main marketplace application (PWA for buyers and sellers) |
| **3032** | `apps/server` | Backend API server (REST API, authentication, database) |
| **4090** | `apps/blog` | Development blog (Docusaurus) |

Access the applications at:
- Web: http://localhost:3030
- App: http://localhost:3031
- Server API: http://localhost:3032
- OpenAPI docs: http://localhost:3032/docs
- Blog: http://localhost:4090

## Project Structure

This is a monorepo managed by Bun workspaces, containing:

### Applications (`apps/`)

- **`app`** - Main user-facing marketplace application (mobile/PWA)
  - Built with TanStack Router, React 19, and Vite
  - Supports both buyer and seller functionality
  - Server-side rendering with TanStack Start
  
- **`web`** - Public marketing website
  - Built with TanStack Router and React 19
  - Static pages (about, privacy policy)
  - Minimal dependencies, optimized for SEO
  
- **`blog`** - Development blog
  - Built with Docusaurus 3
  - Blog-only setup (no docs or pages)
  - RSS and Atom feeds
  - Czech language support
  - Tailwind CSS styling
  
- **`server`** - Backend API server
  - Built with Hono and Nitro
  - PostgreSQL database with Kysely ORM
  - Better Auth for authentication
  - Redis for caching and rate limiting
  - S3 for file storage
  - OpenAPI documentation with Scalar

### Packages (`packages/@zbav-se.me/`)

- **`sdk`** - API client SDK
  - Generated from OpenAPI specification
  - Type-safe API queries and mutations
  - Used by frontend applications

- **`ui`** - Common UI component library
  - Reusable React components
  - Tailwind CSS styling
  - No domain-specific logic

- **`common`** - Shared domain components
  - Domain-specific UI components (age, category, condition, location, etc.)
  - Shared business logic
  - Common utilities

- **`buyer`** - Buyer domain package
  - Buyer-specific components and logic
  - Listing transactions, favourites

- **`seller`** - Seller domain package
  - Seller-specific components and logic
  - Listing management

### Use-Pico Framework (`packages/@use-pico/`)

Internal framework packages providing core functionality:
- **`client`** - Client-side utilities, hooks, and components
- **`common`** - Shared utilities and types
- **`server`** - Server-side utilities and middleware

## Package Dependency Graph

```
┌─────────────────────────────────────────────────────────────────────┐
│                         APPLICATION LAYER                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐         │
│  │  apps/app   │      │  apps/web   │      │ apps/server │         │
│  │             │      │             │      │             │         │
│  │  (mobile)   │      │  (website)  │      │  (backend)  │         │
│  └──────┬──────┘      └──────┬──────┘      └──────┬──────┘         │
│         │                    │                    │                 │
│         └────────────────────┼────────────────────┘                 │
│                              │                                       │
└──────────────────────────────┼───────────────────────────────────────┘
                               │
┌──────────────────────────────┼───────────────────────────────────────┐
│                         DOMAIN LAYER                                 │
├──────────────────────────────┼───────────────────────────────────────┤
│                              │                                       │
│              ┌───────────────┴───────────────┐                      │
│              │                               │                      │
│         ┌────▼────┐                    ┌─────▼─────┐               │
│         │  buyer  │                    │  seller   │               │
│         └────┬────┘                    └─────┬─────┘               │
│              │                               │                      │
│              └───────────────┬───────────────┘                      │
│                              │                                       │
│                         ┌────▼────┐                                 │
│                         │ common  │                                 │
│                         └────┬────┘                                 │
│                              │                                       │
└──────────────────────────────┼───────────────────────────────────────┘
                               │
┌──────────────────────────────┼───────────────────────────────────────┐
│                       FOUNDATION LAYER                               │
├──────────────────────────────┼───────────────────────────────────────┤
│                              │                                       │
│                    ┌─────────┴──────────┐                           │
│                    │                    │                           │
│               ┌────▼────┐          ┌────▼────┐                      │
│               │   sdk   │          │   ui    │                      │
│               │         │          │         │                      │
│               │  (API)  │          │  (UI)   │                      │
│               └─────────┘          └─────────┘                      │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘

DEPENDENCY RULES:
├─ sdk, ui: No @zbav-se.me dependencies (foundation packages)
├─ common: May import from sdk, ui
├─ buyer, seller: May import from common, sdk, ui
├─ apps/app: May import from buyer, seller, common, sdk, ui
├─ apps/web: May import from ui only
└─ apps/server: May import from common only

Legend:
  ┌─────┐
  │ pkg │  = Package/Application
  └──┬──┘
     ▼     = Dependency direction (depends on)
```

## Technology Stack

### Frontend
- **React 19** - UI framework
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Data fetching and caching
- **TanStack Form** - Form management
- **Tailwind CSS 4** - Styling
- **Vite** - Build tool
- **Docusaurus 3** - Blog platform

### Backend
- **Hono** - Web framework
- **Nitro** - Server engine
- **Kysely** - SQL query builder
- **PostgreSQL** - Database
- **Redis (Upstash)** - Caching and rate limiting
- **Better Auth** - Authentication
- **MinIO** - S3-compatible object storage
- **Effect** - Functional programming utilities

### DevOps
- **Bun** - Package manager and runtime
- **TypeScript** - Type safety
- **Biome** - Linting and formatting
- **Turbo** - Monorepo task runner

## Tooling Notes

- The repository is Bun-first, but Syncpack with `.syncpackrc.ts` still requires Node.js in CI for TypeScript config loading.
- GitHub Actions must provide Node.js `22.6.0` or newer so `bun x syncpack ...` can read `.syncpackrc.ts`.

## Environment Variables

### Server (`apps/server/`)

Server-side environment variables used by the backend API:

- `SERVER_DATABASE_URL` - PostgreSQL connection string
- `SERVER_BETTER_AUTH_SECRET` - Better Auth secret key
- `SERVER_JWT_SECRET` - JWT token signing secret
- `SERVER_GEOAPIFY_TOKEN` - Geoapify API key for location services
- `SERVER_AXIOM_TOKEN` - Axiom API token for log ingestion
- `SERVER_AXIOM_DATASET` - Axiom dataset name for log ingestion
- `SERVER_S3_API` - S3 API endpoint URL
- `SERVER_S3_KEY` - S3 access key
- `SERVER_S3_SECRET` - S3 secret key
- `SERVER_S3_BUCKET` - S3 bucket name
- `SERVER_UPSTASH_REDIS_URL` - Upstash Redis REST URL
- `SERVER_UPSTASH_REDIS_TOKEN` - Upstash Redis REST token
- `SERVER_CONTENT_CDN` - CDN base URL for static assets
- `VITE_DOMAIN` - Domain configuration
- `VITE_SERVER_API` - Server API endpoint URL (for server-side requests)
- `VITE_WEB_ORIGIN` - Web application origin URL (for CORS)
- `VITE_APP_ORIGIN` - App application origin URL (for CORS)

### Web App (`apps/web/`)

Client-side environment variables for the public website:

- `VITE_WEB_ASSETS` - Web asset base URL for build
- `VITE_WEB_ORIGIN` - Web application origin URL
- `VITE_SERVER_API` - Server API endpoint URL
- `VITE_DOMAIN` - Domain configuration

### App (`apps/app/`)

Client-side environment variables for the main marketplace application:

- `VITE_APP_ASSETS` - App asset base URL for build
- `VITE_APP_ORIGIN` - App application origin URL
- `VITE_SERVER_API` - Server API endpoint URL
- `VITE_DOMAIN` - Domain configuration

## Development

```bash
# Install dependencies
bun install

# Run all applications in dev mode
bun dev

# Run specific app
cd apps/app && bun dev    # Port 3031
cd apps/web && bun dev    # Port 3030
cd apps/server && bun dev # Port 3032
cd apps/blog && bun dev   # Port 4090

# Type checking
bun run typecheck

# Build all packages
bun run build

# Generate API SDK from OpenAPI spec
cd packages/@zbav-se.me/sdk && bun run sdk
```

## Contribution Guardrails

- Shared implementation rules: `AGENTS.md`
- App overlays:
  - `apps/app/AGENTS.md`
  - `apps/web/AGENTS.md`
  - `apps/server/AGENTS.md`
- Product and domain invariants source of truth: `MASTER.md`
