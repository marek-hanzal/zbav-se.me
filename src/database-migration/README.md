# Database migrations

`constant/migrations.ts` is the ordered Kysely migration registry. Keep schema
changes and their reference data in this domain. The application migration
operation in `databaseFx` also runs Better Auth migrations and reference-data
imports, including the bundled translation files.

`script/migrate.ts` is the standalone deployment entry point. The separate
`vite.migration.config.ts` bundles the same operation and transforms Vite's
translation asset imports. `runMigrationFn` creates a single-connection pool and
always closes it. The program exits nonzero on failure; it does not require a
running application server or call the public migration endpoint.

`argc release <dev|uat|prod>` builds the application and migration program
together. Terraform runs the program locally using that workspace's direct Neon
connection before uploading assets and deploying Vercel. See
[`infra/README.md`](../../infra/README.md) for credentials and deployment commands.
Kysely tracks completed migrations in PostgreSQL. Imports intentionally rerun,
so they must remain idempotent. Terraform's release marker is orchestration
state, not database migration history.

Run the compiled-runner integration checks with:

```bash
argc test test/database-migration/runner.test.ts
```

They build into a temporary directory, migrate a fresh disposable database,
repeat the operation, check auth/translation setup, and verify failure exit status.
