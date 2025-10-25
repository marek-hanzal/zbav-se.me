# Zbav se mě!

A marketplace application for buying and selling items.

## Environment Variables

### Server (`apps/server/`)

Server-side environment variables used by the backend API:

- `SERVER_DATABASE_URL` - Database connection string
- `DOMAIN` - Domain configuration
- `WEB_ORIGIN` - Web application origin URL (for CORS)
- `APP_ORIGIN` - App application origin URL (for CORS)
- `SERVER_BETTER_AUTH_SECRET` - Better Auth secret key
- `SERVER_JWT_SECRET` - JWT token signing secret
- `SERVER_GEOAPIFY_TOKEN` - Geoapify API key
- `SERVER_S3_API` - S3 API endpoint URL
- `SERVER_S3_KEY` - S3 access key
- `SERVER_S3_SECRET` - S3 secret key
- `SERVER_S3_BUCKET` - S3 bucket name
- `SERVER_UPSTASH_REDIS_REST_URL` - Upstash Redis REST URL
- `SERVER_UPSTASH_REDIS_REST_TOKEN` - Upstash Redis REST token

### Web App (`apps/web/`)

Client-side environment variables for the web application:

- `VITE_WEB_ASSET_BASE` - Web asset base URL for build
- `VITE_SERVER_API` - Server API endpoint URL
- `WEB_ORIGIN` - Web application origin URL

### App (`apps/app/`)

Client-side environment variables for the mobile app:

- `VITE_APP_ASSET_BASE` - App asset base URL for build
- `VITE_SERVER_API` - Server API endpoint URL
- `APP_ORIGIN` - App application origin URL
