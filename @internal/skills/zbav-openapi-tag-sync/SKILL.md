---
name: zbav-openapi-tag-sync
description: Keep server OpenAPI tags and docs metadata consistent when adding or changing endpoints, including updates to the public tag registry.
---

# Zbav OpenAPI Tag Sync

## Use this when
- Adding new server endpoints or changing endpoint domains/tags
- Updating OpenAPI docs behavior
- Ensuring docs navigation remains clean

## Required checks
1. Every endpoint has meaningful `summary`, `description`, `operationId`, and `tags`.
2. New/renamed tags are registered in:
- `apps/server/src/@public/open-api/open-api.ts` (`tagsRegistry`)
3. Endpoint response schemas match real handler responses.

## Workflow
1. Scan changed endpoint files for `createRoute` metadata.
2. Collect tag names used by changed endpoints.
3. Diff against `tagsRegistry` and add missing entries.
4. Keep tag descriptions short and domain-accurate.
5. Run relevant checks and report registry updates.

## Output expectations
- No orphan/unregistered tags in changed endpoints.
- Docs metadata remains navigable and internally consistent.
