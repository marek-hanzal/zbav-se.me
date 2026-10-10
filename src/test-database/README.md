# Test database

`withTestabaseFx` owns a disposable PostgreSQL container with a unique name,
loopback-only port chosen by Docker, and a real tmpfs data mount. It migrates and
seeds the template once, closes its connections, and freezes it against new
connections before publishing `{dsn, containerName, cleanupFn}`. Bootstrap
failures close pools and remove the owned container. Cleanup is idempotent; no
pre-existing container is removed. The helper never mutates application env.

`testabaseFn` requires an explicit `dsn`, database Effect, and teardown callback.
Each allocation receives a unique physical name, even when two tests use the same
diagnostic label. It returns the database instance plus `databaseName` and an
idempotent `cleanupFn`, and registers cleanup with the supplied callback. Failed
allocation or teardown registration also cleans up. One admin pool handles both
creation and deletion; a separate single-connection pool belongs to the test.
Cloning is serialized only around `CREATE DATABASE`, without deleting old names
or polling the frozen template on every allocation.

Close all other clients, including the application server's cached pool, before
cleanup. Cleanup waits briefly for connections to close and reports leaked
application names and states. If connections remain, it force-drops only the
owned test clone and still fails with the leak diagnostic. Pool-close and drop
errors are aggregated, so one failure cannot skip the remaining cleanup.

Vitest passes its run DSN through `provide`/`inject`. Playwright receives it from
the `argc e2e` launcher before starting the app; its wrapper validates the inherited
`SERVER_DATABASE_URL`. Reusable helpers do not read the application environment.

Fresh clones preserve real transaction behavior and committed writes. An outer
rollback transaction is not a substitute: it would change nested transaction
behavior and cannot isolate the separate connections used by E2E requests.
