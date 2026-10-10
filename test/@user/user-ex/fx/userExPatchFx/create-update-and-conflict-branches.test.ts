import { Effect } from "effect";
import { PostgresDialect, sql } from "kysely";
import { Pool } from "pg";
import { describe, expect, inject, it } from "vitest";
import type { Database } from "~/database/type/Database";
import { withDatabaseNameFn } from "~/database-query/fn/withDatabaseNameFn";
import { withDialectFn } from "~/database-query/fn/withDialectFn";
import { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import { MigrationContextFx } from "~/database-query/service/MigrationContextFx";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { expectErrorFn } from "~/test/common/fx/expectErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { userExPatchFx } from "~/user-ex/fx/userExPatchFx";

describe("userExPatchFx", () => {
	it("creates when missing, updates when existing, and hits conflict branch on concurrent create", async () => {
		const database = await testabaseFn("userExPatchFx-create-update-conflict");
		const secondDatabase = await withDatabaseFx<Database>({
			logger: getRootLoggerFn([
				"db",
			]),
		}).pipe(
			withDialectFn(
				new PostgresDialect({
					pool: new Pool({
						connectionString: withDatabaseNameFn({
							dsn: inject("testDatabaseDsn"),
							name: database.databaseName,
						}),
						application_name: "userExPatchFx:secondary",
						max: 1,
					}),
				}),
			),
			Effect.provideService(MigrationContextFx, {}),
			Effect.runPromise,
		);

		const runtimeFx = withRuntimeFn(database);
		const secondRuntimeFx = withRuntimeFn(secondDatabase);

		try {
			return await Effect.gen(function* () {
				const users = yield* createUsersFx({});

				const created = yield* userExPatchFx({
					userId: users.seller.id,
					patch: {
						locationId: null,
					},
				});

				expect(created.userId).toBe(users.seller.id);

				const updated = yield* userExPatchFx({
					userId: users.seller.id,
					patch: {
						locationId: null,
					},
				});

				expect(updated.id).toBe(created.id);

				yield* Effect.promise(() =>
					sql
						.raw(`
					create or replace function user_ex_conflict_delay()
					returns trigger as $$
					begin
						if new."userId" = '${users.buyer.id}' then
							perform pg_sleep(0.25);
						end if;
						return new;
					end;
					$$ language plpgsql;
				`)
						.execute(database.kysely),
				);

				yield* Effect.promise(() =>
					sql`
					create trigger user_ex_conflict_delay_trigger
					before insert on "user_ex"
					for each row
					execute function user_ex_conflict_delay();
				`.execute(database.kysely),
				);

				const parallel = yield* Effect.promise(() =>
					Promise.all([
						userExPatchFx({
							userId: users.buyer.id,
							patch: {
								locationId: null,
							},
						}).pipe(runtimeFx, Effect.result, Effect.runPromise),
						userExPatchFx({
							userId: users.buyer.id,
							patch: {
								locationId: null,
							},
						}).pipe(secondRuntimeFx, Effect.result, Effect.runPromise),
					]),
				);

				const conflicts = parallel.filter((item) => item._tag === "Failure");
				const successes = parallel.filter((item) => item._tag === "Success");
				const conflict = conflicts[0];

				expect(successes.length).toBeGreaterThan(0);
				expect(conflicts.length).toBeGreaterThan(0);

				if (!conflict) {
					throw new Error("Expected at least one conflict branch result");
				}

				expectErrorFn(conflict);

				const buyerUserEx = yield* Effect.promise(() =>
					database.kysely
						.selectFrom("user_ex")
						.selectAll()
						.where("userId", "=", users.buyer.id)
						.execute(),
				);

				expect(buyerUserEx).toHaveLength(1);
			}).pipe(runtimeFx, Effect.runPromise);
		} finally {
			await secondDatabase.kysely.destroy();
		}
	});
});
