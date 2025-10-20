# Environment Variables Documentation

This document lists all the files that need to be updated when adding a new environment variable to the project.

## Required Updates for New Environment Variables

When adding a new environment variable, you must update the following files:

### 1. Server-side Environment Configuration

#### `apps/server/src/AppEnv.ts`
- **Add declaration**: `declare const __NEW_VAR__: string | undefined;`
- **Add validation schema**: `NEW_VAR: z.string().min(1, "Description is required")`
- **Add parsing logic**: Include fallback to `process.env.NEW_VAR`

#### `apps/server/nitro.config.ts`
- **Add build-time injection**: `__NEW_VAR__: JSON.stringify(process.env.NEW_VAR)`

### 2. Build System Configuration

#### `turbo.json`
- **Add to `dev` task**: Include in the `env` array
- **Add to `preview` task**: Include in the `env` array  
- **Add to `build` task**: Include in the `env` array

### 3. Local Development Files

#### `.env.example`
- **Add template entry**: `NEW_VAR=your-value-here`

#### `.env.local`
- **Add local value**: `NEW_VAR=your-local-value`

### 4. Production Deployment

#### `.github/workflows/production.yaml`
- **Add to `validate-env` job environment**: `NEW_VAR: ${{ secrets.NEW_VAR }}` (if secret) or `NEW_VAR: ${{ vars.NEW_VAR }}` (if variable)
- **Add validation check**: `: "${NEW_VAR:?NEW_VAR missing}"`
- **Add to relevant build jobs**: Include in environment variables for jobs that need it

### 5. Client-side Environment Variables (if needed)

#### `apps/client/vite.config.ts`
- **Add if needed for build**: `process.env.NEW_VAR`

#### Client-side code files
- **Use**: `import.meta.env.NEW_VAR` (for Vite environment variables)

## Environment Variable Types

### Server-side Variables
- Used in `AppEnv.ts` and server code
- Available as `AppEnv.NEW_VAR`
- Examples: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `JWT_SECRET`, `GEOAPIFY`

### Client-side Variables (Vite)
- Must be prefixed with `VITE_`
- Available as `import.meta.env.VITE_NEW_VAR`
- Examples: `VITE_API`, `VITE_ASSET_BASE`

### GitHub Secrets vs Variables
- **Secrets** (`${{ secrets.NEW_VAR }}`): Sensitive data like API keys, tokens
- **Variables** (`${{ vars.NEW_VAR }}`): Non-sensitive configuration like URLs

## Current Environment Variables

### Server-side
- `DATABASE_URL` - Database connection string
- `ORIGIN` - Application origin URL (for CORS)
- `COOKIE` - Cookie domain configuration
- `BETTER_AUTH_SECRET` - Better Auth secret key
- `JWT_SECRET` - JWT token signing secret
- `VERCEL_BLOB` - Vercel blob storage token
- `GEOAPIFY` - Geoapify API key
- `VITE_API` - API endpoint URL

### Client-side
- `VITE_ASSET_BASE` - Asset base URL for build
- `VITE_API` - API endpoint URL

## Checklist for New Environment Variables

- [ ] Add declaration to `apps/server/src/AppEnv.ts`
- [ ] Add validation schema to `apps/server/src/AppEnv.ts`
- [ ] Add parsing logic to `apps/server/src/AppEnv.ts`
- [ ] Add build-time injection to `apps/server/nitro.config.ts`
- [ ] Add to `dev` task in `turbo.json`
- [ ] Add to `preview` task in `turbo.json`
- [ ] Add to `build` task in `turbo.json`
- [ ] Add template to `.env.example`
- [ ] Add local value to `.env.local`
- [ ] Add to GitHub Actions workflow environment
- [ ] Add validation check to GitHub Actions workflow
- [ ] Add to relevant build jobs in GitHub Actions
- [ ] Update this documentation

## Notes

- Always use descriptive names for environment variables
- Follow the naming convention: `SCREAMING_SNAKE_CASE`
- Client-side variables must be prefixed with `VITE_`
- Consider security implications when choosing between secrets and variables
- Test locally with `.env.local` before deploying
- Ensure all team members have access to required secrets/variables in GitHub
