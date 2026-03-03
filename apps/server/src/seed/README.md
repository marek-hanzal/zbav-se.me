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
  plus interaction datasets (`message-text-buyer`, `message-text-seller`, `message-personal`, `message-package`)
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
- Seed user creation via Better Auth uses a fixed password `12345678`.
- CLI progress rendering is implemented with `terminal-kit` behind `SeedProgressContextFx`
- Console output uses colored progress and formatted final reports (no raw JSON dump)
- Core report shows generated deltas for the current run
- Core seed records are backdated with randomized timestamps across the last 2 years
- Seeded listing `condition` and `age` use the domain scale `1..6` (never `0`)
- Location warmup uses shuffled location queries from `data/location.json` to avoid repeatedly seeding
  the same first subset on every run. You can override the warmup amount with:
  - `SEED_LOCATION_CYCLES`
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
- Interaction seed executes unique listing candidates in bounded parallel batches and can be tuned using:
  - `SEED_INTERACTION_CONCURRENCY` (default `6`)
  - `SEED_INTERACTION_BATCH_SIZE` (default `25`)
  - `SEED_INTERACTION_SCENARIO_GAP_MINUTES` (default `3`)
- Interaction seed contains an explicit thumb batch phase (`none|like|dislike`) and can be tuned using:
  - `SEED_INTERACTION_THUMB_BATCH_SIZE` (default `100`)
  - `SEED_INTERACTION_THUMB_CONCURRENCY` (default `12`)
- Interaction scenarios are generated with coherent timeline windows:
  - each scenario starts at a random point within the last 2 years
  - scenario actions stay grouped in a 1-3 day window
  - optional "ghost" gaps are inserted between selected message/status steps
  - generated scenario timestamps are clamped to the past (never in the future)
  - metadata and status actions use minute-scale spacing to avoid overlapping timestamps
- Interaction status variants are mixed per run to produce realistic legal flows:
  - `pending -> seller rejected`
  - `pending -> buyer rejected`
  - `pending -> open -> seller rejected`
  - `pending -> open -> buyer rejected`
  - `pending -> open -> resolved -> success`
  - `pending -> open -> resolved -> closed`
  - `pending -> open -> resolved -> buyer dispute -> success|closed`
  - `pending -> open -> resolved -> seller dispute -> success|closed`
