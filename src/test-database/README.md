# Test database

The template database helper requires an explicit `dsn`, database Effect, and
teardown callback. Template creation, connections, and cleanup use that same DSN.

The Vitest wrapper in `test/testabaseFn.ts` and the Playwright wrapper in
`e2e/utils/testabaseFn.ts` validate the application environment with
`ServerDatabaseSchema` and inject `SERVER_DATABASE_URL`. The reusable helper does
not read the application environment.
