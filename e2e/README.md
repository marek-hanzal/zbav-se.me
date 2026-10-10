# Browser and HTTP integration tests

Run Playwright through `argc e2e`, with options forwarded directly:

```bash
argc e2e --list
argc e2e --grep 'application requests read database'
E2E_WORKERS=4 argc e2e
```

The command starts an isolated PostgreSQL container, migrates and seeds its
template once, then launches Playwright with that run's database connection.
Playwright starts and stops the compiled application server. The command removes
its database container after Playwright exits, including unsuccessful runs.
Listing tests does not start the database or application server.

Use the isolated server environment from the root README when a development app
is already running. E2E compilation shares build outputs with `argc build`, so
these commands must run sequentially. The app origin must be available. PostgreSQL
ports and container names are allocated per run; no development container is
removed or reused.

## Per-test isolation

Import `testFn` and `expect` from `e2e/testFn.ts`. Fixtures provide:

- `database`: a fresh clone of the migrated and seeded template, with a direct
  Kysely connection for arranging and inspecting test data.
- `db`: the actual unique database name, allocated through `database`. The
  optional `dbName` setting is a descriptive label, not a shared database name.
- `page` and `context`: browser requests to the application origin carry
  `x-e2e-db`. The route applies to every page in the context, including additional
  pages and popups. Third-party origins do not receive this header. Service
  workers are blocked so they cannot bypass the routing fixture.
- `withRequestFn`: a callback with an isolated HTTP request context carrying the
  same database header. Using only this fixture still allocates the database.
  Each callback starts with its own cookie jar and disposes it afterward. Keep
  related authenticated requests inside one callback to retain their cookies.

Browser routing does not apply to `page.request` or other independently created
HTTP clients. Prefer `withRequestFn` for HTTP scenarios.

Dependent browser and HTTP contexts close before database teardown. Teardown
first asks the E2E-only application endpoint to evict its cached connection pool,
then destroys the test connection and drops the clone. Pool eviction has a
bounded timeout and checks its HTTP response. Database cleanup is always
attempted, even when pool eviction fails; cleanup failures fail the test.

The routing tests share the same descriptive database label and authenticate
against a user email changed only inside each allocated clone. This verifies
separate allocations and that the application reads the selected database;
the header echo alone would not prove database isolation.

## External services

S3 uploads and CDN reads, Geoapify requests, and SMTP delivery intentionally use
their configured services. These tests require working credentials, buckets,
public asset delivery, and Mailpit where a mail assertion is made. They are not
silently mocked or skipped when a service is unavailable.

Set `MAILPIT_BASE_URL` to the inbox API corresponding to the configured SMTP
transport. Mail assertions use a unique recipient per test so previous messages
and parallel database clones cannot satisfy a new assertion. Polling and
individual Mailpit requests are bounded; the shared inbox is not globally reset.

Playwright retains traces, screenshots, and video for failures. Reports and
artifacts live in the configured output directories. `E2E_WORKERS` must be a
positive integer; use it to adjust browser and service concurrency.
