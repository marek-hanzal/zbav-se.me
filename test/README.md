# Vitest tests

Run tests from the repository root through `argc test`. All three projects run
by default; external service tests remain enabled and fail normally when their
configured service is unavailable.

| Project | Files | Infrastructure |
| --- | --- | --- |
| `unit` | `*.unit.test.ts` | No database bootstrap or Docker; local function and contract tests. |
| `integration` | Other `*.test.ts` files | Disposable PostgreSQL with a clean cloned database for each `testabaseFn` call. S3 tests start their own disposable SeaweedFS container. Some application flows also use configured external services. |
| `external` | `*.external.test.ts` | Real external services that do not require a database, currently Geoapify. No PostgreSQL bootstrap or Docker. |

```bash
argc test --project unit
argc test --project integration
argc test --project external
argc test test/@buyer/feed
argc test --project unit --coverage.enabled=false
```

Coverage stays enabled by default and combines all selected projects in
`coverage/vitest`, including unsuccessful runs. Use `--coverage.enabled=false` for a quick local iteration.
Do not overlap runs that write coverage to the same output directory; disable
coverage or set a distinct `--coverage.reportsDirectory` when running in parallel.

The integration global setup starts PostgreSQL on a dynamically assigned local
port, migrates and seeds its template once, and passes the DSN to workers through
Vitest's provided context. It never replaces `SERVER_DATABASE_URL` in the caller's
environment. `testabaseFn` requires that context, clones the template under a
unique database name, and registers cleanup with `onTestFinished`, including after
a failed assertion. The supplied name is a diagnostic label rather than a shared
physical database name. See [`src/test-database/README.md`](../src/test-database/README.md)
for the reusable database resource contract.

S3 integration tests use `withTestS3Fn` to start `chrislusf/seaweedfs:4.48` on a
Docker-assigned loopback port, with tmpfs storage, test credentials, and an
`uploads` bucket. The helper waits for an authenticated bucket check before
returning its explicit S3 configuration and cleanup function. Tests register
cleanup with `onTestFinished`; failed startup also removes its owned container.
Only tests requesting this fixture start S3. No Bunny account, cloud bucket, or
`SERVER_S3_*` environment values are needed or changed. The first run downloads
the pinned image if missing. See [SeaweedFS mini](https://github.com/seaweedfs/seaweedfs/wiki/Quick-Start-with-weed-mini).

The presign integration test performs a signed PUT, reads the stored bytes through
the application client, rejects a tampered signature, and deletes the object.
This covers the S3 protocol locally; Bunny-specific compatibility remains a
separate deployment concern.

Cron scheduling tests mock the S3 delete operation and use `stubS3Fn` for explicit
test environment values. They assert against that fixture's bucket rather than a
developer's configured cloud bucket. Vitest restores the environment after each
test.

Keep database tests in the integration project; a `*.unit.test.ts` test that calls
`testabaseFn` fails with an explicit classification error. Real transaction flows
keep their own database instead of wrapping every test in an outer rollback,
which would change commit and rollback behavior.

All projects isolate JavaScript modules between files. Mocks and environment
stubs are restored between test cases. Test collection and execution continue
after failures so a complete run reports all failures. An empty selection fails
instead of silently reporting success.
