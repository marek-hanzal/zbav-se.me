import { Effect } from "effect";
import { PostgresDialect, sql } from "kysely";
import { Pool } from "pg";
import { describe, expect, it } from "vitest";
import {
	MigrationContextFx,
	withDatabaseFx,
	withDatabaseName,
	withDialectFx,
} from "@/lib/common/database";
import { getRootLogger } from "~/common/log/getRootLogger";
import type { Database } from "~/server/database/Database";
import { ServerDatabaseSchema } from "~/server/env/ServerDatabaseSchema";
import { expectErrorFx } from "~/test/common/fx/expectErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { userExPatchFx } from "~/user/user-ex/server/fx/userExPatchFx";

describe("userExPatchFx", () => {
	it("creates when missing, updates when existing, and hits conflict branch on concurrent create", async () => {
		const database = await testabase("userExPatchFx-create-update-conflict");
		const databaseConfig = ServerDatabaseSchema.parse(process.env);
		const secondDatabase = await withDatabaseFx<Database>({
			logger: getRootLogger([
				"db",
			]),
		}).pipe(
			withDialectFx(
				new PostgresDialect({
					pool: new Pool({
						connectionString: withDatabaseName({
							dsn: databaseConfig.SERVER_DATABASE_URL,
							name: "userExPatchFx-create-update-conflict",
						}),
						application_name: "userExPatchFx:secondary",
						max: 1,
					}),
				}),
			),
			Effect.provideService(MigrationContextFx, {}),
			Effect.runPromise,
		);

		const runtime = withRuntimeFx(database);
		const secondRuntime = withRuntimeFx(secondDatabase);

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
						}).pipe(runtime, Effect.either, Effect.runPromise),
						userExPatchFx({
							userId: users.buyer.id,
							patch: {
								locationId: null,
							},
						}).pipe(secondRuntime, Effect.either, Effect.runPromise),
					]),
				);

				const conflicts = parallel.filter((item) => item._tag === "Left");
				const successes = parallel.filter((item) => item._tag === "Right");
				const conflict = conflicts[0];

				expect(successes.length).toBeGreaterThan(0);
				expect(conflicts.length).toBeGreaterThan(0);

				if (!conflict) {
					throw new Error("Expected at least one conflict branch result");
				}

				expectErrorFx(conflict);

				const buyerUserEx = yield* Effect.promise(() =>
					database.kysely
						.selectFrom("user_ex")
						.selectAll()
						.where("userId", "=", users.buyer.id)
						.execute(),
				);

				expect(buyerUserEx).toHaveLength(1);
			}).pipe(runtime, Effect.runPromise);
		} finally {
			await secondDatabase.kysely.destroy();
		}
	});
});
