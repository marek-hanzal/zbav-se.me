import { Effect } from "effect";
import { sql } from "kysely";
import { Client } from "pg";
import { describe, expect, inject, it, onTestFinished } from "vitest";
import { withDatabaseNameFn } from "~/database-query/fn/withDatabaseNameFn";
import { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import { MigrationContextFx } from "~/database-query/service/MigrationContextFx";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { testabaseFn } from "~/test-database/fn/testabaseFn";

interface IsolationDatabase {
	test_isolation_marker: {
		id: string;
		value: string;
	};
}

const databaseFx = withDatabaseFx<IsolationDatabase>({
	logger: getRootLoggerFn([
		"test",
		"database-lifecycle",
	]),
}).pipe(Effect.provideService(MigrationContextFx, {}));

describe("test database lifecycle", () => {
	it("isolates simultaneous allocations with the same label and keeps the template clean", async () => {
		const dsn = inject("testDatabaseDsn");
		const [first, second] = await Promise.all([
			testabaseFn({
				dsn,
				databaseFx,
				name: "same-label",
				onTestFinishedFn: onTestFinished,
			}),
			testabaseFn({
				dsn,
				databaseFx,
				name: "same-label",
				onTestFinishedFn: onTestFinished,
			}),
		]);

		expect(first.databaseName).not.toBe(second.databaseName);
		await Promise.all(
			[
				first,
				second,
			].map(async (database, index) => {
				await database.kysely.schema
					.createTable("test_isolation_marker")
					.addColumn("id", "text", (column) => column.primaryKey())
					.addColumn("value", "text", (column) => column.notNull())
					.execute();
				await database.kysely
					.insertInto("test_isolation_marker")
					.values({
						id: "shared-key",
						value: `clone-${index}`,
					})
					.execute();
			}),
		);

		expect(
			await first.kysely.selectFrom("test_isolation_marker").selectAll().execute(),
		).toEqual([
			{
				id: "shared-key",
				value: "clone-0",
			},
		]);
		expect(
			await second.kysely.selectFrom("test_isolation_marker").selectAll().execute(),
		).toEqual([
			{
				id: "shared-key",
				value: "clone-1",
			},
		]);

		const fresh = await testabaseFn({
			dsn,
			databaseFx,
			name: "same-label",
			onTestFinishedFn: onTestFinished,
		});
		const marker = await sql<{
			relation: string | null;
		}>`
			SELECT to_regclass('public.test_isolation_marker')::text AS relation
		`.execute(fresh.kysely);
		expect(marker.rows).toEqual([
			{
				relation: null,
			},
		]);
	});

	it("drops an allocation once and leaves another live clone usable", async () => {
		const dsn = inject("testDatabaseDsn");
		const first = await testabaseFn({
			dsn,
			databaseFx,
			onTestFinishedFn: onTestFinished,
		});
		const second = await testabaseFn({
			dsn,
			databaseFx,
			onTestFinishedFn: onTestFinished,
		});

		await Promise.all([
			first.cleanupFn(),
			first.cleanupFn(),
		]);
		await first.cleanupFn();
		const existing = await sql<{
			datname: string;
		}>`
			SELECT datname FROM pg_database WHERE datname = ${first.databaseName}
		`.execute(second.kysely);
		expect(existing.rows).toEqual([]);
		const live = await sql<{
			name: string;
		}>`SELECT current_database() AS name`.execute(second.kysely);
		expect(live.rows).toEqual([
			{
				name: second.databaseName,
			},
		]);
	});

	it("cleans the clone when registering its teardown fails", async () => {
		const dsn = inject("testDatabaseDsn");
		const observer = await testabaseFn({
			dsn,
			databaseFx,
			onTestFinishedFn: onTestFinished,
		});
		let allocatedName: string | undefined;
		let cleanupFn: (() => Promise<unknown>) | undefined;
		onTestFinished(async () => {
			await cleanupFn?.();
		});
		const observedDatabaseFx = databaseFx.pipe(
			Effect.tap((database) =>
				Effect.promise(async () => {
					const result = await sql<{
						name: string;
					}>`SELECT current_database() AS name`.execute(database.kysely);
					allocatedName = result.rows[0]?.name;
				}),
			),
		);

		await expect(
			testabaseFn({
				dsn,
				databaseFx: observedDatabaseFx,
				name: "registration-failure",
				onTestFinishedFn(callbackFn) {
					cleanupFn = callbackFn;
					throw new Error("Teardown registration failed");
				},
			}),
		).rejects.toThrow("Teardown registration failed");

		expect(allocatedName).toBeTypeOf("string");
		const existing = await sql<{
			datname: string;
		}>`
			SELECT datname FROM pg_database WHERE datname = ${allocatedName}
		`.execute(observer.kysely);
		expect(existing.rows).toEqual([]);
	});

	it("reports leaked connections while still dropping its owned clone", async () => {
		const dsn = inject("testDatabaseDsn");
		const observer = await testabaseFn({
			dsn,
			databaseFx,
			onTestFinishedFn: onTestFinished,
		});
		const database = await testabaseFn({
			dsn,
			databaseFx,
			name: "connection-leak",
			onTestFinishedFn() {},
		});
		const client = new Client({
			connectionString: withDatabaseNameFn({
				dsn,
				name: database.databaseName,
			}),
			application_name: "intentional-test-connection-leak",
		});
		client.on("error", () => {});

		try {
			await client.connect();
			await client.query("SELECT 1");
			const failure = await database.cleanupFn().catch((error: unknown) => error);
			expect(failure).toBeInstanceOf(AggregateError);
			if (!(failure instanceof AggregateError)) {
				throw new Error("Expected leaked connections to fail database cleanup");
			}
			expect(failure.errors.map(String).join("\n")).toContain(
				"intentional-test-connection-leak",
			);
			const existing = await sql<{
				datname: string;
			}>`
				SELECT datname FROM pg_database WHERE datname = ${database.databaseName}
			`.execute(observer.kysely);
			expect(existing.rows).toEqual([]);
		} finally {
			await client.end();
			await database.cleanupFn().catch(() => {});
		}
	});
});
