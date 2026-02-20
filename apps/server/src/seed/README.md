# seed

Effect-only seed domain for server CLI scripts.

## Overview

This domain contains all seed orchestration and helpers used by:

- `seed-core` - creates core content records
- `seed-interaction` - creates interaction scenarios

Both scripts are implemented as Effect programs and are called from the repository root through `dotenv`,
which executes server CLI directly (without Turbo wrapping) to keep terminal progress rendering readable.

## Contract

Both scripts require exactly two arguments:

- `--count <positive-int>`
- `--user <email>`

`count` means how many records should be generated in the current run (append mode), not a final target state.
Exception: `location` is cache-like and best-effort (warmup cycles), so it is not expected to match `count`.
Location warmup queries are loaded from `src/seed/data/location.json` (copied from app dev dataset), not hardcoded inline.

## Structure

- `schema/` - CLI argument schemas
- `data/` - seed datasets (`location`, listing titles, listing descriptions, listing pros, listing cons)
- `context/` - shared Effect contexts (progress/TUI)
- `fx/core/` - core seed units (locations, uploads, listings, feeds)
  plus seed-only high-throughput insert helpers (`seed*InsertFx`, bulk gallery item inserts)
- `fx/interaction/` - interaction seed units (transactions, messages, reactions)
- `fx/progress/` - progress/TUI helpers
- `fx/report/` - typed report schemas and count snapshots

## Rules

- Seed logic must stay Effect-first (`Effect.fn`, `Effect.gen`)
- External side effects use `Effect.promise`/`Effect.tryPromise`
- Existing production Fx must be preferred over direct SQL for business actions
- Seed core hot paths are allowed to use internal seed-only insert Fx
  (no public API exposure) when this is required for benchmark throughput.
  Those insert Fx must stay in `src/seed` and must not leak into API handlers.
- CLI progress rendering is implemented with `terminal-kit` behind `SeedProgressContextFx`
- Console output uses colored progress and formatted final reports (no raw JSON dump)
- Core report shows generated deltas for the current run
- Seed runtime manages a scoped PostgreSQL pool and explicitly closes it on program end
  to avoid delayed process exit after report rendering
- Both CLI scripts append one benchmark JSONL line into `benchmark.jsonl`
  (current working directory) with:
  `stamp`, `count`, `totalCount`, and normalized `runtimePerItemMs`
- Core seed write-heavy loops use bounded Effect concurrency (instead of full serial writes)
  to reduce runtime while keeping database pressure controlled
- Concurrency defaults to `7` and can be tuned using:
  - `SEED_CORE_CONCURRENCY` (shared override)
  - `SEED_FEED_CONCURRENCY`, `SEED_GALLERY_CONCURRENCY`, `SEED_LISTING_CONCURRENCY`
